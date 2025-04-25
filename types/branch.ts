export interface Branch {
  id: number
  name: string
  address: string
  business_id: number
  parent_id: number | null
  created_at?: string
  updated_at?: string
  children?: Branch[]
}
