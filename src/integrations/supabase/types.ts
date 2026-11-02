export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      banners: {
        Row: {
          accent: string | null
          active: boolean | null
          btn_text: string | null
          category: string | null
          created_at: string | null
          description: string | null
          id: number
          image: string | null
          link: string | null
          sort_order: number | null
          subtitle: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          accent?: string | null
          active?: boolean | null
          btn_text?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          image?: string | null
          link?: string | null
          sort_order?: number | null
          subtitle?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          accent?: string | null
          active?: boolean | null
          btn_text?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          image?: string | null
          link?: string | null
          sort_order?: number | null
          subtitle?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      berita: {
        Row: {
          active: boolean | null
          author: string | null
          category: string | null
          content: string | null
          created_at: string | null
          event_date: string | null
          featured: boolean | null
          id: number
          image: string | null
          location: string | null
          photo_source: string | null
          published_at: string | null
          slug: string | null
          source_name: string | null
          source_url: string | null
          status: string | null
          submitter_email: string | null
          submitter_name: string | null
          summary: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          author?: string | null
          category?: string | null
          content?: string | null
          created_at?: string | null
          event_date?: string | null
          featured?: boolean | null
          id?: number
          image?: string | null
          location?: string | null
          photo_source?: string | null
          published_at?: string | null
          slug?: string | null
          source_name?: string | null
          source_url?: string | null
          status?: string | null
          submitter_email?: string | null
          submitter_name?: string | null
          summary?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          author?: string | null
          category?: string | null
          content?: string | null
          created_at?: string | null
          event_date?: string | null
          featured?: boolean | null
          id?: number
          image?: string | null
          location?: string | null
          photo_source?: string | null
          published_at?: string | null
          slug?: string | null
          source_name?: string | null
          source_url?: string | null
          status?: string | null
          submitter_email?: string | null
          submitter_name?: string | null
          summary?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      community_applications: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: number
          interest: string
          reason: string | null
          whatsapp: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: number
          interest: string
          reason?: string | null
          whatsapp: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: number
          interest?: string
          reason?: string | null
          whatsapp?: string
        }
        Relationships: []
      }
      digital_services: {
        Row: {
          active: boolean | null
          category: string | null
          created_at: string | null
          description: string | null
          featured: boolean | null
          id: number
          image: string | null
          price: number | null
          title: string | null
          updated_at: string | null
          whatsapp: string | null
        }
        Insert: {
          active?: boolean | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          id?: number
          image?: string | null
          price?: number | null
          title?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Update: {
          active?: boolean | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          id?: number
          image?: string | null
          price?: number | null
          title?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      event_tickets: {
        Row: {
          active: boolean | null
          created_at: string | null
          description: string | null
          event_id: number | null
          id: number
          name: string | null
          price: number | null
          quota: number | null
          sale_end: string | null
          sale_start: string | null
          sold: number | null
          sort_order: number | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          event_id?: number | null
          id?: number
          name?: string | null
          price?: number | null
          quota?: number | null
          sale_end?: string | null
          sale_start?: string | null
          sold?: number | null
          sort_order?: number | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          event_id?: number | null
          id?: number
          name?: string | null
          price?: number | null
          quota?: number | null
          sale_end?: string | null
          sale_start?: string | null
          sold?: number | null
          sort_order?: number | null
        }
        Relationships: []
      }
      events: {
        Row: {
          active: boolean | null
          allow_voucher: boolean | null
          banner_image: string | null
          category: string | null
          created_at: string | null
          crew_active: boolean | null
          date: string | null
          date_end: string | null
          description: string | null
          featured: boolean | null
          guest_stars: Json | null
          id: number
          image: string | null
          location: string | null
          maps_url: string | null
          menu_items: Json | null
          name: string | null
          organizer: string | null
          organizer_ig: string | null
          payment_info: Json | null
          price: number | null
          prohibited_items: Json | null
          rundown: Json | null
          service_fee_percent: number | null
          slug: string | null
          time_end: string | null
          time_start: string | null
          title: string | null
          transportation_info: Json | null
          updated_at: string | null
          visitors: number | null
        }
        Insert: {
          active?: boolean | null
          allow_voucher?: boolean | null
          banner_image?: string | null
          category?: string | null
          created_at?: string | null
          crew_active?: boolean | null
          date?: string | null
          date_end?: string | null
          description?: string | null
          featured?: boolean | null
          guest_stars?: Json | null
          id?: number
          image?: string | null
          location?: string | null
          maps_url?: string | null
          menu_items?: Json | null
          name?: string | null
          organizer?: string | null
          organizer_ig?: string | null
          payment_info?: Json | null
          price?: number | null
          prohibited_items?: Json | null
          rundown?: Json | null
          service_fee_percent?: number | null
          slug?: string | null
          time_end?: string | null
          time_start?: string | null
          title?: string | null
          transportation_info?: Json | null
          updated_at?: string | null
          visitors?: number | null
        }
        Update: {
          active?: boolean | null
          allow_voucher?: boolean | null
          banner_image?: string | null
          category?: string | null
          created_at?: string | null
          crew_active?: boolean | null
          date?: string | null
          date_end?: string | null
          description?: string | null
          featured?: boolean | null
          guest_stars?: Json | null
          id?: number
          image?: string | null
          location?: string | null
          maps_url?: string | null
          menu_items?: Json | null
          name?: string | null
          organizer?: string | null
          organizer_ig?: string | null
          payment_info?: Json | null
          price?: number | null
          prohibited_items?: Json | null
          rundown?: Json | null
          service_fee_percent?: number | null
          slug?: string | null
          time_end?: string | null
          time_start?: string | null
          title?: string | null
          transportation_info?: Json | null
          updated_at?: string | null
          visitors?: number | null
        }
        Relationships: []
      }
      influencers: {
        Row: {
          active: boolean | null
          bio: string | null
          color: string | null
          color2: string | null
          created_at: string | null
          handle: string | null
          id: number
          instagram: string | null
          location: string | null
          name: string | null
          niches: string[] | null
          photos: string[] | null
          rate: string | null
          rating: number | null
          sort_order: number | null
          tiktok: string | null
          updated_at: string | null
          verified: boolean | null
        }
        Insert: {
          active?: boolean | null
          bio?: string | null
          color?: string | null
          color2?: string | null
          created_at?: string | null
          handle?: string | null
          id?: number
          instagram?: string | null
          location?: string | null
          name?: string | null
          niches?: string[] | null
          photos?: string[] | null
          rate?: string | null
          rating?: number | null
          sort_order?: number | null
          tiktok?: string | null
          updated_at?: string | null
          verified?: boolean | null
        }
        Update: {
          active?: boolean | null
          bio?: string | null
          color?: string | null
          color2?: string | null
          created_at?: string | null
          handle?: string | null
          id?: number
          instagram?: string | null
          location?: string | null
          name?: string | null
          niches?: string[] | null
          photos?: string[] | null
          rate?: string | null
          rating?: number | null
          sort_order?: number | null
          tiktok?: string | null
          updated_at?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      kamus_sunda: {
        Row: {
          active: boolean | null
          category: string | null
          created_at: string | null
          example: string | null
          id: number
          indonesia: string | null
          latin: string | null
          level: string | null
          sunda: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          category?: string | null
          created_at?: string | null
          example?: string | null
          id?: number
          indonesia?: string | null
          latin?: string | null
          level?: string | null
          sunda?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          category?: string | null
          created_at?: string | null
          example?: string | null
          id?: number
          indonesia?: string | null
          latin?: string | null
          level?: string | null
          sunda?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      kuliner: {
        Row: {
          active: boolean | null
          category: string | null
          created_at: string | null
          description: string | null
          facilities: string | null
          featured: boolean | null
          google_maps_url: string | null
          hours: string | null
          id: number
          image: string | null
          instagram: string | null
          location: string | null
          maps_embed_url: string | null
          name: string | null
          phone: string | null
          photos: string | null
          price_range: string | null
          rating: number | null
          reservasi_enabled: boolean | null
          slug: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          active?: boolean | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          facilities?: string | null
          featured?: boolean | null
          google_maps_url?: string | null
          hours?: string | null
          id?: number
          image?: string | null
          instagram?: string | null
          location?: string | null
          maps_embed_url?: string | null
          name?: string | null
          phone?: string | null
          photos?: string | null
          price_range?: string | null
          rating?: number | null
          reservasi_enabled?: boolean | null
          slug?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          active?: boolean | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          facilities?: string | null
          featured?: boolean | null
          google_maps_url?: string | null
          hours?: string | null
          id?: number
          image?: string | null
          instagram?: string | null
          location?: string | null
          maps_embed_url?: string | null
          name?: string | null
          phone?: string | null
          photos?: string | null
          price_range?: string | null
          rating?: number | null
          reservasi_enabled?: boolean | null
          slug?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      media_archive: {
        Row: {
          id: string
          manifest: Json
          updated_at: string
        }
        Insert: {
          id: string
          manifest?: Json
          updated_at?: string
        }
        Update: {
          id?: string
          manifest?: Json
          updated_at?: string
        }
        Relationships: []
      }
      partners: {
        Row: {
          active: boolean | null
          color: string | null
          created_at: string | null
          id: number
          name: string | null
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          color?: string | null
          created_at?: string | null
          id?: number
          name?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          color?: string | null
          created_at?: string | null
          id?: number
          name?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      penginapan: {
        Row: {
          active: boolean | null
          amenities: string[] | null
          booking_enabled: boolean | null
          category: string | null
          created_at: string | null
          description: string | null
          featured: boolean | null
          id: number
          image: string | null
          instagram: string | null
          location: string | null
          name: string | null
          price_per_night: number | null
          rating: number | null
          slug: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          amenities?: string[] | null
          booking_enabled?: boolean | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          id?: number
          image?: string | null
          instagram?: string | null
          location?: string | null
          name?: string | null
          price_per_night?: number | null
          rating?: number | null
          slug?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          amenities?: string[] | null
          booking_enabled?: boolean | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          id?: number
          image?: string | null
          instagram?: string | null
          location?: string | null
          name?: string | null
          price_per_night?: number | null
          rating?: number | null
          slug?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      perlombaan: {
        Row: {
          active: boolean | null
          category: string | null
          created_at: string | null
          date: string | null
          description: string | null
          featured: boolean | null
          fee: number | null
          id: number
          image: string | null
          location: string | null
          max_peserta: number | null
          name: string | null
          organizer: string | null
          prize: number | null
        }
        Insert: {
          active?: boolean | null
          category?: string | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          featured?: boolean | null
          fee?: number | null
          id?: number
          image?: string | null
          location?: string | null
          max_peserta?: number | null
          name?: string | null
          organizer?: string | null
          prize?: number | null
        }
        Update: {
          active?: boolean | null
          category?: string | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          featured?: boolean | null
          fee?: number | null
          id?: number
          image?: string | null
          location?: string | null
          max_peserta?: number | null
          name?: string | null
          organizer?: string | null
          prize?: number | null
        }
        Relationships: []
      }
      price_list: {
        Row: {
          active: boolean | null
          category: string | null
          created_at: string | null
          description: string | null
          id: number
          item: string | null
          price: number | null
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          item?: string | null
          price?: number | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          item?: string | null
          price?: number | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      promo_banners: {
        Row: {
          active: boolean | null
          created_at: string | null
          id: number
          image: string | null
          link: string | null
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          id?: number
          image?: string | null
          link?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          id?: number
          image?: string | null
          link?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string | null
          value: string | null
        }
        Insert: {
          key: string
          updated_at?: string | null
          value?: string | null
        }
        Update: {
          key?: string
          updated_at?: string | null
          value?: string | null
        }
        Relationships: []
      }
      talents: {
        Row: {
          active: boolean | null
          bio: string | null
          category: string | null
          created_at: string | null
          featured: boolean | null
          id: number
          instagram: string | null
          name: string | null
          photo: string | null
          role: string | null
          sort_order: number | null
          tagline: string | null
          tags: string[] | null
          updated_at: string | null
          verified: boolean | null
          wa: string | null
        }
        Insert: {
          active?: boolean | null
          bio?: string | null
          category?: string | null
          created_at?: string | null
          featured?: boolean | null
          id?: number
          instagram?: string | null
          name?: string | null
          photo?: string | null
          role?: string | null
          sort_order?: number | null
          tagline?: string | null
          tags?: string[] | null
          updated_at?: string | null
          verified?: boolean | null
          wa?: string | null
        }
        Update: {
          active?: boolean | null
          bio?: string | null
          category?: string | null
          created_at?: string | null
          featured?: boolean | null
          id?: number
          instagram?: string | null
          name?: string | null
          photo?: string | null
          role?: string | null
          sort_order?: number | null
          tagline?: string | null
          tags?: string[] | null
          updated_at?: string | null
          verified?: boolean | null
          wa?: string | null
        }
        Relationships: []
      }
      transportasi: {
        Row: {
          active: boolean | null
          asal: string | null
          created_at: string | null
          description: string | null
          frekuensi: string | null
          id: number
          jam: string | null
          kode: string | null
          name: string | null
          tarif: number | null
          tujuan: string | null
          type: string | null
          updated_at: string | null
          via: string | null
        }
        Insert: {
          active?: boolean | null
          asal?: string | null
          created_at?: string | null
          description?: string | null
          frekuensi?: string | null
          id?: number
          jam?: string | null
          kode?: string | null
          name?: string | null
          tarif?: number | null
          tujuan?: string | null
          type?: string | null
          updated_at?: string | null
          via?: string | null
        }
        Update: {
          active?: boolean | null
          asal?: string | null
          created_at?: string | null
          description?: string | null
          frekuensi?: string | null
          id?: number
          jam?: string | null
          kode?: string | null
          name?: string | null
          tarif?: number | null
          tujuan?: string | null
          type?: string | null
          updated_at?: string | null
          via?: string | null
        }
        Relationships: []
      }
      vouchers: {
        Row: {
          active: boolean | null
          applicable_type: string | null
          code: string | null
          created_at: string | null
          description: string | null
          discount_type: string | null
          discount_value: number | null
          expiry_date: string | null
          id: number
          kuliner_id: number | null
          min_purchase: number | null
          mitra_id: number | null
          required_points: number | null
          title: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          applicable_type?: string | null
          code?: string | null
          created_at?: string | null
          description?: string | null
          discount_type?: string | null
          discount_value?: number | null
          expiry_date?: string | null
          id?: number
          kuliner_id?: number | null
          min_purchase?: number | null
          mitra_id?: number | null
          required_points?: number | null
          title?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          applicable_type?: string | null
          code?: string | null
          created_at?: string | null
          description?: string | null
          discount_type?: string | null
          discount_value?: number | null
          expiry_date?: string | null
          id?: number
          kuliner_id?: number | null
          min_purchase?: number | null
          mitra_id?: number | null
          required_points?: number | null
          title?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      wisata: {
        Row: {
          active: boolean | null
          category: string | null
          created_at: string | null
          description: string | null
          entry_fee: number | null
          facilities: string | null
          google_maps_url: string | null
          id: number
          image: string | null
          instagram: string | null
          location: string | null
          maps_embed_url: string | null
          name: string | null
          opening_hours: string | null
          partner: boolean | null
          phone: string | null
          photos: string | null
          rating: number | null
          slug: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          active?: boolean | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          entry_fee?: number | null
          facilities?: string | null
          google_maps_url?: string | null
          id?: number
          image?: string | null
          instagram?: string | null
          location?: string | null
          maps_embed_url?: string | null
          name?: string | null
          opening_hours?: string | null
          partner?: boolean | null
          phone?: string | null
          photos?: string | null
          rating?: number | null
          slug?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          active?: boolean | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          entry_fee?: number | null
          facilities?: string | null
          google_maps_url?: string | null
          id?: number
          image?: string | null
          instagram?: string | null
          location?: string | null
          maps_embed_url?: string | null
          name?: string | null
          opening_hours?: string | null
          partner?: boolean | null
          phone?: string | null
          photos?: string | null
          rating?: number | null
          slug?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
