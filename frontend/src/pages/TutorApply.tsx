import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { tutorApi } from '@/api/modules/tutor'
import { commonApi } from '@/api/modules/common'
import { useAuthStore } from '@/stores/authStore'
import { Link } from 'react-router-dom'

export default function TutorApply() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    age: '',
    school_id: '',
    major: '',
    grade: '',
    tutor_type: 'student',
    teaching_age: 0,
    hourly_rate: '',
    min_hourly_rate: '',
    introduction: '',
    teaching_experience: '',
    phone: '',
    wechat: '',
    subject_ids: [] as number[],
    area_ids: [] as number[],
  })

  const { data: areas } = useQuery({
    queryKey: ['areas'],
    queryFn: commonApi.getAreas,
  })

  const { data: subjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: commonApi.getSubjects,
  })

  const { data: schools } = useQuery({
    queryKey: ['schools'],
    queryFn: commonApi.getSchools,
  })

  const applyMutation = useMutation({
    mutationFn: tutorApi.apply,
    onSuccess: () => {
      alert('申请已提交，请等待审核')
      navigate('/user')
    },
    onError: (error: any) => {
      alert(error.response?.data?.detail || '申请失败')
    },
  })

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="mb-4">请先登录后再申请入驻</p>
        <Link to="/login">
          <Button>去登录</Button>
        </Link>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    applyMutation.mutate({
      ...formData,
      age: formData.age ? Number(formData.age) : undefined,
      school_id: formData.school_id ? Number(formData.school_id) : undefined,
      teaching_age: Number(formData.teaching_age),
      hourly_rate: formData.hourly_rate ? Number(formData.hourly_rate) : undefined,
      min_hourly_rate: formData.min_hourly_rate ? Number(formData.min_hourly_rate) : undefined,
    })
  }

  const handleCheckboxChange = (
    field: 'subject_ids' | 'area_ids',
    id: number
  ) => {
    setFormData((prev) => {
      const current = prev[field]
      if (current.includes(id)) {
        return { ...prev, [field]: current.filter((i) => i !== id) }
      } else {
        return { ...prev, [field]: [...current, id] }
      }
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">老师入驻申请</h1>

      <Card>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">姓名 *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">性别</label>
                <select
                  className="w-full border rounded px-3 py-2 h-10"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="">请选择</option>
                  <option value="male">男</option>
                  <option value="female">女</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">年龄</label>
                <Input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">联系电话 *</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* School Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">学校</label>
                <select
                  className="w-full border rounded px-3 py-2 h-10"
                  value={formData.school_id}
                  onChange={(e) => setFormData({ ...formData, school_id: e.target.value })}
                >
                  <option value="">请选择学校</option>
                  {schools?.map((s: { id: number; name: string }) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">专业</label>
                <Input
                  value={formData.major}
                  onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">年级</label>
                <Input
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  placeholder="如：大一、研二"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">教员类型 *</label>
                <select
                  className="w-full border rounded px-3 py-2 h-10"
                  value={formData.tutor_type}
                  onChange={(e) => setFormData({ ...formData, tutor_type: e.target.value })}
                >
                  <option value="student">大学生</option>
                  <option value="professional">专业教师</option>
                  <option value="foreign">海归外教</option>
                </select>
              </div>
            </div>

            {/* Teaching Info */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">教龄（年）</label>
                <Input
                  type="number"
                  value={formData.teaching_age}
                  onChange={(e) => setFormData({ ...formData, teaching_age: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">时薪（元/时）</label>
                <Input
                  type="number"
                  value={formData.hourly_rate}
                  onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
                  placeholder="如：100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">最低价（元/时）</label>
                <Input
                  type="number"
                  value={formData.min_hourly_rate}
                  onChange={(e) => setFormData({ ...formData, min_hourly_rate: e.target.value })}
                  placeholder="如：50"
                />
              </div>
            </div>

            {/* Subjects */}
            <div>
              <label className="block text-sm font-medium mb-2">擅长科目 *</label>
              <div className="flex flex-wrap gap-2">
                {subjects?.map((s: { id: number; name: string }) => (
                  <label
                    key={s.id}
                    className={`px-3 py-1 rounded cursor-pointer ${
                      formData.subject_ids.includes(s.id)
                        ? 'bg-primary text-white'
                        : 'bg-gray-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={formData.subject_ids.includes(s.id)}
                      onChange={() => handleCheckboxChange('subject_ids', s.id)}
                    />
                    {s.name}
                  </label>
                ))}
              </div>
            </div>

            {/* Areas */}
            <div>
              <label className="block text-sm font-medium mb-2">服务区域</label>
              <div className="flex flex-wrap gap-2">
                {areas?.map((a: { id: number; name: string }) => (
                  <label
                    key={a.id}
                    className={`px-3 py-1 rounded cursor-pointer ${
                      formData.area_ids.includes(a.id)
                        ? 'bg-primary text-white'
                        : 'bg-gray-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={formData.area_ids.includes(a.id)}
                      onChange={() => handleCheckboxChange('area_ids', a.id)}
                    />
                    {a.name}
                  </label>
                ))}
              </div>
            </div>

            {/* Introduction */}
            <div>
              <label className="block text-sm font-medium mb-1">个人简介 *</label>
              <textarea
                className="w-full border rounded px-3 py-2 h-32"
                value={formData.introduction}
                onChange={(e) => setFormData({ ...formData, introduction: e.target.value })}
                placeholder="介绍一下自己..."
                required
              />
            </div>

            {/* Teaching Experience */}
            <div>
              <label className="block text-sm font-medium mb-1">教学经历/成功案例</label>
              <textarea
                className="w-full border rounded px-3 py-2 h-32"
                value={formData.teaching_experience}
                onChange={(e) => setFormData({ ...formData, teaching_experience: e.target.value })}
                placeholder="描述您的教学经历或成功案例..."
              />
            </div>

            <Button type="submit" className="w-full" disabled={applyMutation.isPending}>
              {applyMutation.isPending ? '提交中...' : '提交申请'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
