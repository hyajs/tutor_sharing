import { useEffect, useRef, useState } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { mockTutors } from '@/mock/data'
import { Link } from 'react-router-dom'

const AMAP_KEY = import.meta.env.VITE_AMAP_KEY || ''
const AMAP_VERSION = '2.0'

declare global {
  interface Window {
    AMap: any
  }
}

export default function MapSearch() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const [selectedTutor, setSelectedTutor] = useState<(typeof mockTutors)[0] | null>(null)

  useEffect(() => {
    // 加载高德地图 SDK
    const loadMap = () => {
      if (!mapRef.current) return

      // 检查是否已经加载过
      if (window.AMap && mapInstanceRef.current) {
        initMap()
        return
      }

      const callbackName = 'amap_callback'
      ;(window as any)[callbackName] = () => {
        initMap()
      }

      const script = document.createElement('script')
      script.src = `https://webapi.amap.com/maps?v=${AMAP_VERSION}&key=${AMAP_KEY}&plugin=AMap.Scale,AMap.ToolBar&callback=${callbackName}`
      script.onerror = () => {
        // setMapLoaded removed
        console.error('高德地图加载失败')
      }
      document.head.appendChild(script)
    }

    const initMap = () => {
      if (!mapRef.current || mapInstanceRef.current) return

      try {
        const map = new window.AMap.Map(mapRef.current, {
          zoom: 11,
          center: [119.647933, 29.078967], // 金华市婺城区
          viewMode: '2D',
        })

        mapInstanceRef.current = map

        // 添加比例尺和工具栏
        map.addControl(new window.AMap.Scale())
        map.addControl(new window.AMap.ToolBar({ position: 'RB' }))

// 添加教员标记
        addTutorMarkers(map)
        // map ready
      } catch (error) {
        console.error('地图初始化失败:', error)
        // setMapLoaded removed
      }
    }

    const addTutorMarkers = (map: any) => {
      const tutorsWithLocation = mockTutors.filter(t => t.longitude && t.latitude)

      tutorsWithLocation.forEach((tutor) => {
        const marker = new window.AMap.Marker({
          position: [tutor.longitude!, tutor.latitude!],
          title: tutor.name,
          content: createMarkerContent(tutor),
        })

        marker.on('click', () => {
          setSelectedTutor(tutor)
        })

        map.add(marker)
      })
    }

    const createMarkerContent = (tutor: typeof mockTutors[0]) => {
      const div = document.createElement('div')
      div.className = 'tutor-marker'
      div.innerHTML = `
        <div style="
          background: linear-gradient(135deg, #5181e5 0%, #3b6cd4 100%);
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          box-shadow: 0 2px 8px rgba(81,129,229,0.4);
          white-space: nowrap;
          cursor: pointer;
        ">
          ¥${tutor.hourly_rate}/时
        </div>
      `
      return div
    }

    loadMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy()
        mapInstanceRef.current = null
      }
    }
  }, [])

  const tutorTypes: Record<string, string> = {
    student: '大学生',
    professional: '专业教师',
    foreign: '海归外教',
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">地图找老师</h1>

      <div className="flex gap-6">
        {/* Map */}
        <div className="flex-1">
          <Card>
            <CardContent className="p-0">
              <div
                ref={mapRef}
                className="w-full h-[500px] md:h-[600px] rounded-lg"
                style={{ background: '#e5e7eb' }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Tutor List Sidebar */}
        <div className="w-80 flex-shrink-0 hidden lg:block">
          <div className="bg-white rounded-lg shadow p-4 sticky top-4 max-h-[600px] overflow-y-auto">
            <h3 className="font-bold mb-4">附近教员 ({mockTutors.length})</h3>
            <div className="space-y-3">
              {mockTutors.map((tutor) => (
                <Link
                  key={tutor.id}
                  to={`/tutors/${tutor.id}`}
                  className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-lg font-bold text-primary">
                      {tutor.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{tutor.name}</span>
                        {tutor.is_verified && (
                          <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded flex-shrink-0">
                            已认证
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {tutor.school?.name || '未知学校'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {tutorTypes[tutor.tutor_type]} · 教龄{tutor.teaching_age}年
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-primary font-bold">¥{tutor.hourly_rate}</div>
                      <div className="text-xs text-gray-400">/时</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Tutor Modal */}
      {selectedTutor && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedTutor(null)}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-2xl font-bold text-primary">
                {selectedTutor.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold">{selectedTutor.name}</h3>
                  {selectedTutor.is_verified && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">已认证</span>
                  )}
                </div>
                <p className="text-gray-500">{selectedTutor.school?.name}</p>
                <p className="text-sm text-gray-400">{tutorTypes[selectedTutor.tutor_type]} · 教龄{selectedTutor.teaching_age}年</p>
              </div>
              <button onClick={() => setSelectedTutor(null)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xl font-bold text-primary">¥{selectedTutor.hourly_rate}</div>
                <div className="text-xs text-gray-500">元/时</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xl font-bold">{selectedTutor.teaching_age}年</div>
                <div className="text-xs text-gray-500">教龄</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xl font-bold">{selectedTutor.view_count}</div>
                <div className="text-xs text-gray-500">浏览</div>
              </div>
            </div>

            <p className="mt-4 text-gray-600 text-sm line-clamp-3">
              {selectedTutor.introduction}
            </p>

            <div className="mt-4 flex gap-2">
              {selectedTutor.subjects?.slice(0, 3).map((s: any) => (
                <span key={s.id} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {s.name}
                </span>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <Link to={`/tutors/${selectedTutor.id}`} className="flex-1">
                <Button className="w-full">查看详情</Button>
              </Link>
              <Button variant="outline">收藏</Button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Tutor Cards */}
      <div className="mt-6 lg:hidden">
        <h3 className="font-bold mb-4">附近教员 ({mockTutors.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockTutors.map((tutor) => (
            <Link
              key={tutor.id}
              to={`/tutors/${tutor.id}`}
              className="block p-4 rounded-lg hover:shadow-md transition-shadow border border-gray-100 bg-white"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-lg font-bold text-primary">
                  {tutor.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{tutor.name}</span>
                    {tutor.is_verified && (
                      <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded flex-shrink-0">
                        已认证
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {tutor.school?.name || '未知学校'}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-primary font-bold">¥{tutor.hourly_rate}</div>
                  <div className="text-xs text-gray-400">/时</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}