import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/Button'
import { useQuery } from '@tanstack/react-query'
import { authApi } from '@/api/modules/auth'
import { useEffect } from 'react'

export function Layout() {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout, setUser, setTokens } = useAuthStore()

  // 获取用户信息
  useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      if (isAuthenticated) {
        const userData = await authApi.getCurrentUser()
        setUser(userData)
        return userData
      }
      return null
    },
    enabled: isAuthenticated,
  })

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-primary">浙师大北门家教</span>
            </Link>

            {/* Nav */}
            <nav className="flex items-center gap-6">
              <Link to="/tutors" className="text-gray-600 hover:text-primary">
                教员库
              </Link>
              <Link to="/map" className="text-gray-600 hover:text-primary">
                地图找老师
              </Link>
              <Link to="/apply" className="text-gray-600 hover:text-primary">
                老师入驻
              </Link>

              {/* Auth */}
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <Link to="/user" className="text-gray-600 hover:text-primary">
                    {user?.username || '用户中心'}
                  </Link>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    退出
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login">
                    <Button variant="outline" size="sm">
                      登录
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm">注册</Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">关于我们</h3>
              <p className="text-gray-400 text-sm">
                浙师大北门家教竭诚为您提供名校大学生、在职中小学老师等优秀老师上门家教服务。
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">快速链接</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li><Link to="/tutors" className="hover:text-white">教员库</Link></li>
                <li><Link to="/map" className="hover:text-white">地图找老师</Link></li>
                <li><Link to="/apply" className="hover:text-white">老师入驻</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">帮助中心</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li><Link to="/help/parent" className="hover:text-white">家长指南</Link></li>
                <li><Link to="/help/tutor" className="hover:text-white">老师指南</Link></li>
                <li><Link to="/help/payment" className="hover:text-white">支付方式</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">联系我们</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>电话: 13732444321</li>
                <li>微信: 扫描关注</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
            © 2024 浙师大北门家教 版权所有
          </div>
        </div>
      </footer>
    </div>
  )
}
