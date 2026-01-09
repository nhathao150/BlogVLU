'use server'

import { clerkClient } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

export async function deleteUser(userId: string) {
  try {
    const client = await clerkClient()
    
    // Ra lệnh cho Clerk xóa user này
    await client.users.deleteUser(userId)
    
    // Refresh lại trang danh sách
    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Không thể xóa user này' }
  }
}