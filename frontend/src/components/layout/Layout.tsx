import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/Button'
import { useQuery } from '@tanstack/react-query'
import { authApi } from '@/api/modules/auth'
import * as Dialog from '@radix-ui/react-dialog'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Layout() {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout, setUser } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
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

            {/* Mobile Menu Button */}
            <Dialog.Root open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <Dialog.Trigger asChild>
                <button className="md:hidden p-2 text-gray-600">
                  <Menu size={24} />
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
                <Dialog.Content className="fixed right-0 top-0 h-full w-64 bg-white z-50 p-6 shadow-lg">
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-bold text-primary">菜单</span>
                    <Dialog.Close asChild>
                      <button className="p-2 text-gray-600">
                        <X size={24} />
                      </button>
                    </Dialog.Close>
                  </div>
                  <nav className="flex flex-col gap-4">
                    <Link to="/tutors" className="text-gray-600 hover:text-primary py-2" onClick={() => setMobileMenuOpen(false)}>
                      教员库
                    </Link>
                    <Link to="/map" className="text-gray-600 hover:text-primary py-2" onClick={() => setMobileMenuOpen(false)}>
                      地图找老师
                    </Link>
                    <Link to="/apply" className="text-gray-600 hover:text-primary py-2" onClick={() => setMobileMenuOpen(false)}>
                      老师入驻
                    </Link>
                    {isAuthenticated ? (
                      <>
                        <Link to="/user" className="text-gray-600 hover:text-primary py-2" onClick={() => setMobileMenuOpen(false)}>
                          {user?.username || '用户中心'}
                        </Link>
                        <Button variant="outline" onClick={() => { handleLogout(); setMobileMenuOpen(false) }}>
                          退出
                        </Button>
                      </>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="outline" className="w-full">登录</Button>
                        </Link>
                        <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                          <Button className="w-full">注册</Button>
                        </Link>
                      </div>
                    )}
                  </nav>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
