import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/stores/authStore'

export default function UserCenter() {
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">用户中心</h1>

      <div className="grid grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="col-span-1">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <Link
                  to="/user/favorites"
                  className="block px-4 py-2 rounded hover:bg-gray-100"
                >
                  我的收藏
                </Link>
                <Link
                  to="/user/orders"
                  className="block px-4 py-2 rounded hover:bg-gray-100"
                >
                  我的订单
                </Link>
                <Link
                  to="/user/profile"
                  className="block px-4 py-2 rounded hover:bg-gray-100"
                >
                  个人资料
                </Link>
                {user?.user_type === 'tutor' && (
                  <Link
                    to="/user/tutor-profile"
                    className="block px-4 py-2 rounded hover:bg-gray-100"
                  >
                    教员资料
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>欢迎回来，{user?.username}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-gray-500">我的收藏</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-gray-500">我的订单</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-gray-500">预约试听</div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-bold mb-4">快捷操作</h3>
                <div className="flex gap-4">
                  <Link to="/tutors">
                    <Button variant="outline">浏览教员</Button>
                  </Link>
                  <Link to="/apply">
                    <Button variant="outline">申请入驻</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
