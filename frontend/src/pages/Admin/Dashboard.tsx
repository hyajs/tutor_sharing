import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/stores/authStore'
import { Link } from 'react-router-dom'

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="mb-4">请先登录</p>
        <Link to="/login">
          <Button>去登录</Button>
        </Link>
      </div>
    )
  }

  if (user?.user_type !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="mb-4">您没有管理员权限</p>
        <Link to="/">
          <Button>返回首页</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">管理后台</h1>

      <div className="grid grid-cols-4 gap-6">
        <Link to="/admin/tutors">
          <Card className="hover:shadow-lg cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold">0</div>
              <div className="text-gray-500">教员总数</div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/applications">
          <Card className="hover:shadow-lg cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold">0</div>
              <div className="text-gray-500">待审核入驻</div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/orders">
          <Card className="hover:shadow-lg cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold">0</div>
              <div className="text-gray-500">订单总数</div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/users">
          <Card className="hover:shadow-lg cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold">0</div>
              <div className="text-gray-500">用户总数</div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>待处理事项</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            暂无待处理事项
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
