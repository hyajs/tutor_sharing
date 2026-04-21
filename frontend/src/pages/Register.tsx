import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { authApi } from '@/api/modules/auth'
import { useAuthStore } from '@/stores/authStore'

export default function Register() {
  const navigate = useNavigate()
  const { setUser, setTokens } = useAuthStore()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [captcha, setCaptcha] = useState({ id: '', image: '' })
  const [captchaCode, setCaptchaCode] = useState('')

  // 获取图形验证码
  const { refetch: refetchCaptcha } = useQuery({
    queryKey: ['captcha'],
    queryFn: async () => {
      const data = await authApi.getCaptcha()
      setCaptcha(data)
      return data
    },
    enabled: false,
  })

  // 初始加载验证码
  useState(() => {
    refetchCaptcha()
  })

  const registerMutation = useMutation({
    mutationFn: authApi.register,
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
      alert(error.response?.data?.detail || '注册失败')
      refetchCaptcha()
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert('两次密码输入不一致')
      return
    }
    registerMutation.mutate({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      captcha_code: captchaCode,
      captcha_id: captcha.id,
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">注册</CardTitle>
          <CardDescription>创建新账号，开始使用家教服务</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">用户名</label>
              <Input
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="请输入用户名"
                required
              />
            </div>
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
            <div>
              <label className="block text-sm font-medium mb-1">确认密码</label>
              <Input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">验证码</label>
              <div className="flex gap-2">
                <Input
                  value={captchaCode}
                  onChange={(e) => setCaptchaCode(e.target.value)}
                  placeholder="请输入验证码"
                  required
                />
                {captcha.image && (
                  <img
                    src={`data:image/png;base64,${captcha.image}`}
                    alt="验证码"
                    className="cursor-pointer"
                    onClick={() => refetchCaptcha()}
                  />
                )}
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
              {registerMutation.isPending ? '注册中...' : '注册'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            已有账号？{' '}
            <Link to="/login" className="text-primary hover:underline">
              立即登录
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
