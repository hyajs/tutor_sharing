import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { authApi } from '@/api/modules/auth'
import { useAuthStore } from '@/stores/authStore'

export default function Login() {
  const navigate = useNavigate()
  const { setUser, setTokens } = useAuthStore()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: async (data) => {
      setTokens(data.access_token, data.refresh_token)
      try {
        const user = await authApi.getCurrentUser()
        setUser(user)
      } catch (e) {
        // ignore
      }
      navigate('/')
    },
    onError: (error: any) => {
      alert(error.response?.data?.detail || '登录失败')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    loginMutation.mutate(formData)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">登录</CardTitle>
          <CardDescription>欢迎回来！请登录您的账号</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">邮箱</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">密码</label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? '登录中...' : '登录'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            还没有账号？{' '}
            <Link to="/register" className="text-primary hover:underline">
              立即注册
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
