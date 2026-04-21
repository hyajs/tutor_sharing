import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { tutorApi } from '@/api/modules/tutor'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/stores/authStore'

export default function TutorDetail() {
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated } = useAuthStore()

  const { data: tutor, isLoading } = useQuery({
    queryKey: ['tutor', id],
    queryFn: () => tutorApi.getById(Number(id)),
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">加载中...</div>
      </div>
    )
  }

  if (!tutor) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">教员不存在</div>
      </div>
    )
  }

  const tutorTypeMap = {
    professional: '专业教师',
    student: '大学生',
    foreign: '海归外教',
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex gap-8">
            {/* Avatar */}
            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-4xl flex-shrink-0">
              {tutor.name.charAt(0)}
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{tutor.name}</h1>
                {tutor.is_verified && (
                  <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
                    已认证
                  </span>
                )}
              </div>

              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-gray-500 text-sm">教龄</div>
                  <div className="font-medium">{tutor.teaching_age}年</div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm">类型</div>
                  <div className="font-medium">{tutorTypeMap[tutor.tutor_type as keyof typeof tutorTypeMap]}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm">性别</div>
                  <div className="font-medium">{tutor.gender === 'male' ? '男' : '女'}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm">年龄</div>
                  <div className="font-medium">{tutor.age || '-'}</div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-gray-500 text-sm">学校</div>
                  <div className="font-medium">{tutor.school?.name || '-'}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm">专业</div>
                  <div className="font-medium">{tutor.major || '-'}</div>
                </div>
              </div>
            </div>

            {/* Price & Action */}
            <div className="text-center border-l pl-8">
              <div className="text-3xl font-bold text-primary">
                {tutor.hourly_rate || tutor.min_hourly_rate || 0}
              </div>
              <div className="text-gray-500">元/时</div>
              {isAuthenticated ? (
                <Link to={`/order/new?tutor_id=${tutor.id}`}>
                  <Button className="mt-4 w-full">立即预约</Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button className="mt-4 w-full">登录后预约</Button>
                </Link>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="col-span-2">
          {/* Introduction */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>个人简介</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">
                {tutor.introduction || '暂无简介'}
              </p>
            </CardContent>
          </Card>

          {/* Teaching Experience */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>教学经历/成功案例</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">
                {tutor.teaching_experience || '暂无教学经历'}
              </p>
            </CardContent>
          </Card>

          {/* Subjects */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>擅长科目</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {tutor.subjects?.map((s: { id: number; name: string }) => (
                  <span
                    key={s.id}
                    className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Service Areas */}
          <Card>
            <CardHeader>
              <CardTitle>服务区域</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {tutor.areas?.map((a: { id: number; name: string }) => (
                  <span
                    key={a.id}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full"
                  >
                    {a.name}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div>
          {/* Contact */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>联系方式</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-gray-500 text-sm">电话</div>
                <div className="font-medium">{tutor.phone || '-'}</div>
              </div>
              <div>
                <div className="text-gray-500 text-sm">微信</div>
                <div className="font-medium">{tutor.wechat || '-'}</div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>数据统计</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">浏览次数</span>
                <span>{tutor.view_count}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">收藏次数</span>
                <span>{tutor.favorite_count}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
