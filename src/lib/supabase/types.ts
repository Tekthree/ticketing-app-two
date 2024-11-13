export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string | null
          role: 'admin' | 'organizer' | 'user'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name?: string | null
          role?: 'admin' | 'organizer' | 'user'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string | null
          role?: 'admin' | 'organizer' | 'user'
          created_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          venue: string
          date: string
          organizer_id: string
          status: 'draft' | 'published' | 'cancelled'
          capacity: number
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          venue: string
          date: string
          organizer_id: string
          status?: 'draft' | 'published' | 'cancelled'
          capacity: number
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          venue?: string
          date?: string
          organizer_id?: string
          status?: 'draft' | 'published' | 'cancelled'
          capacity?: number
          created_at?: string
        }
      }
      ticket_types: {
        Row: {
          id: string
          event_id: string
          name: string
          price: number
          quantity: number
          quantity_sold: number
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          name: string
          price: number
          quantity: number
          quantity_sold?: number
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          name?: string
          price?: number
          quantity?: number
          quantity_sold?: number
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          ticket_type_id: string
          quantity: number
          total_amount: number
          payment_status: 'pending' | 'completed' | 'failed'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          ticket_type_id: string
          quantity: number
          total_amount: number
          payment_status?: 'pending' | 'completed' | 'failed'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          ticket_type_id?: string
          quantity?: number
          total_amount?: number
          payment_status?: 'pending' | 'completed' | 'failed'
          created_at?: string
        }
      }
    }
  }
}
