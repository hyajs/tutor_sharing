import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { tutorApi } from '@/api/modules/tutor'
import { commonApi } from '@/api/modules/common'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useSearchStore } from '@/stores/searchStore'

export default function TutorList() {
  const { filters, setFilters } = useSearchStore()

  // 获取列表数据
  const { data, isLoading } = useQuery({
    queryKey: ['tutors', filters],
    queryFn: () => tutorApi.list(filters),
  })

  // 获取筛选选项
  const { data: areas } = useQuery({
    queryKey: ['areas'],
    queryFn: commonApi.getAreas,
  })

  const { data: subjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: commonApi.getSubjects,
  })

  const handleFilterChange = (key: string, value: string | number | boolean | undefined) => {
    setFilters({ [key]: value, page: 1 })
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const keyword = formData.get('keyword') as string
    setFilters({ keyword, page: 1 })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <aside className="w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <h3 className="font-bold mb-4">筛选条件</h3>

            {/* Search */}
            <form onSubmit={handleSearch} className="mb-6">
              <Input
                name="keyword"
                placeholder="搜索教员/科目"
                defaultValue={filters.keyword}
              />
              <Button type="submit" className="w-full mt-2" size="sm">
                搜索
              </Button>
            </form>

            {/* Area Filter */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">服务区域</h4>
              <select
                className="w-full border rounded px-3 py-2"
                value={filters.area_id || ''}
                onChange={(e) =>
                  handleFilterChange('area_id', e.target.value ? Number(e.target.value) : undefined)
                }
              >
                <option value="">全部区域</option>
                {areas?.map((area: { id: number; name: string }) => (
                  <option key={area.id} value={area.id}>
                    {area.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject Filter */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">科目</h4>
              <select
                className="w-full border rounded px-3 py-2"
                value={filters.subject_id || ''}
                onChange={(e) =>
                  handleFilterChange('subject_id', e.target.value ? Number(e.target.value) : undefined)
                }
              >
                <option value="">全部科目</option>
                {subjects?.map((subject: { id: number; name: string }) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tutor Type Filter */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">教员类型</h4>
              <select
                className="w-full border rounded px-3 py-2"
                value={filters.tutor_type || ''}
                onChange={(e) =>
                  handleFilterChange('tutor_type', e.target.value || undefined)
                }
              >
                <option value="">全部类型</option>
                <option value="professional">专业教师</option>
                <option value="student">大学生</option>
                <option value="foreign">海归外教</option>
              </select>
            </div>

            {/* Gender Filter */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">性别</h4>
              <select
                className="w-full border rounded px-3 py-2"
                value={filters.gender || ''}
                onChange={(e) =>
                  handleFilterChange('gender', e.target.value || undefined)
                }
              >
                <option value="">不限</option>
                <option value="male">男教员</option>
                <option value="female">女教员</option>
              </select>
            </div>

            {/* Verified Filter */}
            <div className="mb-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.is_verified || false}
                  onChange={(e) =>
                    handleFilterChange('is_verified', e.target.checked ? true : undefined)
                  }
                />
                <span className="font-medium">只看已认证教员</span>
              </label>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setFilters({ ...filters, page: 1 })}
            >
              重置筛选
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">教员库</h1>
            <span className="text-gray-500">
              共 {data?.total || 0} 位教员
            </span>
          </div>

          {isLoading ? (
            <div className="text-center py-12">加载中...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data?.items?.map((tutor: any) => (
                  <Link key={tutor.id} to={`/tutors/${tutor.id}`}>
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                            {tutor.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-bold">{tutor.name}</h3>
                              {tutor.is_verified && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                                  已认证
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">
                              {tutor.school?.name || '未知学校'} · {tutor.major || ''}
                            </p>
                            <div className="flex gap-4 mt-2 text-sm text-gray-600">
                              <span>教龄: {tutor.teaching_age}年</span>
                              <span>
                                类型:{' '}
                                {tutor.tutor_type === 'professional'
                                  ? '专业教师'
                                  : tutor.tutor_type === 'student'
                                  ? '大学生'
                                  : '海归外教'}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-primary">
                              {tutor.hourly_rate || tutor.min_hourly_rate || 0}
                            </div>
                            <div className="text-sm text-gray-500">元/时</div>
                          </div>
                        </div>
                        {tutor.introduction && (
                          <p className="mt-4 text-gray-600 text-sm line-clamp-2">
                            {tutor.introduction}
                          </p>
                        )}
                        <div className="mt-4 flex gap-2">
                          {tutor.subjects?.slice(0, 3).map((s: { id: number; name: string }) => (
                            <span
                              key={s.id}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                            >
                              {s.name}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {data && data.total > data.page_size && (
                <div className="mt-8 flex justify-center gap-2">
                  <Button
                    variant="outline"
                    disabled={data.page <= 1}
                    onClick={() => setFilters({ page: data.page - 1 })}
                  >
                    上一页
                  </Button>
                  <span className="flex items-center px-4">
                    第 {data.page} / {Math.ceil(data.total / data.page_size)} 页
                  </span>
                  <Button
                    variant="outline"
                    disabled={data.page >= Math.ceil(data.total / data.page_size)}
                    onClick={() => setFilters({ page: data.page + 1 })}
                  >
                    下一页
                  </Button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}