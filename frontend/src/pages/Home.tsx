import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { useQuery } from '@tanstack/react-query'
import { tutorApi } from '@/api/modules/tutor'
import { commonApi } from '@/api/modules/common'
import { useSearchStore } from '@/stores/searchStore'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()
  const { setFilters, resetFilters } = useSearchStore()

  // 获取教员列表
  const { data: tutorsData, isLoading } = useQuery({
    queryKey: ['tutors', { page: 1, page_size: 6 }],
    queryFn: () => tutorApi.list({ page: 1, page_size: 6 }),
  })

  // 获取筛选数据
  const { data: areas } = useQuery({
    queryKey: ['areas'],
    queryFn: commonApi.getAreas,
  })

  const { data: subjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: commonApi.getSubjects,
  })

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const keyword = formData.get('keyword') as string
    setFilters({ keyword, page: 1 })
    navigate('/tutors')
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            找金华家教，请选择浙师大北门家教
          </h1>
          <p className="text-xl mb-8">
            名校大学生、在职老师，专业辅导，助力学习提升
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-2">
            <Input
              name="keyword"
              placeholder="输入“小学数学”、“初一英语”试试..."
              className="flex-1 h-12 text-lg"
            />
            <Button type="submit" size="lg" className="h-12">
              搜索
            </Button>
          </form>

          {/* Quick Stats */}
          <div className="mt-12 flex justify-center gap-8">
            <div>
              <div className="text-3xl font-bold">500+</div>
              <div className="text-blue-100">注册教员</div>
            </div>
            <div>
              <div className="text-3xl font-bold">98%</div>
              <div className="text-blue-100">好评率</div>
            </div>
            <div>
              <div className="text-3xl font-bold">9</div>
              <div className="text-blue-100">服务区域</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">按区域找家教</h2>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
            {areas?.map((area: { id: number; name: string }) => (
              <Link
                key={area.id}
                to={`/tutors?area_id=${area.id}`}
                onClick={() => setFilters({ area_id: area.id, page: 1 })}
              >
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <div className="text-lg font-medium">{area.name}</div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Subject Categories */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">按科目找家教</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {subjects
              ?.filter((s: { level: number }) => s.level === 1)
              .slice(0, 12)
              .map((subject: { id: number; name: string }) => (
                <Link
                  key={subject.id}
                  to={`/tutors?subject_id=${subject.id}`}
                  onClick={() => setFilters({ subject_id: subject.id, page: 1 })}
                >
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <div className="text-lg font-medium">{subject.name}</div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Featured Tutors */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">优秀教员推荐</h2>
            <Link to="/tutors">
              <Button variant="outline">查看更多</Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-12">加载中...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutorsData?.items?.map((tutor) => (
                <Link key={tutor.id} to={`/tutors/${tutor.id}`}>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
                          {tutor.name.charAt(0)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {tutor.name}
                            {tutor.is_verified && (
                              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                                已认证
                              </span>
                            )}
                          </CardTitle>
                          <p className="text-sm text-gray-500">
                            {tutor.school?.name || '未知学校'} · {tutor.major || ''}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">教龄:</span>
                          <span>{tutor.teaching_age}年</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">类型:</span>
                          <span>
                            {tutor.tutor_type === 'professional'
                              ? '专业教师'
                              : tutor.tutor_type === 'student'
                              ? '大学生'
                              : '海归外教'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">收费:</span>
                          <span className="text-primary font-medium">
                            {tutor.hourly_rate || tutor.min_hourly_rate || 0}元/时
                          </span>
                        </div>
                      </div>
                      {tutor.introduction && (
                        <p className="mt-4 text-gray-600 text-sm line-clamp-2">
                          {tutor.introduction}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">24小时在线请家教</h2>
          <p className="text-xl mb-8">
            快速匹配，满意付费，让学习更高效
          </p>
          <Link to="/tutors">
            <Button size="lg" variant="secondary">
              立即找家教
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
