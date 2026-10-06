import urllib.request
import json

base_url = 'http://supabasekong-k7v0e6lnxjwerisif54rzczl.187.77.131.65.sslip.io'
service_key = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc4MjAzOTkwMCwiZXhwIjo0OTM3NzEzNTAwLCJyb2xlIjoic2VydmljZV9yb2xlIn0.DrdZTVKHvVSgJsJWciIIOyq91lJodQAzUTZ8FCTV7h4'

sql = """
-- Enable pgcrypto if not enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. app_categories
CREATE TABLE IF NOT EXISTS public.app_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name_primary TEXT NOT NULL,
    name_secondary TEXT,
    icon TEXT,
    image_url TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true
);

-- 2. app_products
CREATE TABLE IF NOT EXISTS public.app_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    code TEXT,
    name_primary TEXT NOT NULL,
    name_secondary TEXT,
    description TEXT,
    price NUMERIC NOT NULL,
    original_price NUMERIC,
    stock INTEGER DEFAULT 0,
    category_id UUID REFERENCES public.app_categories(id) ON DELETE SET NULL,
    images TEXT[] DEFAULT '{}',
    variants JSONB DEFAULT '[]',
    benefits TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. app_settings
CREATE TABLE IF NOT EXISTS public.app_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    site_name TEXT DEFAULT 'Al-Shifa Care',
    hotline_number TEXT,
    whatsapp_number TEXT,
    whatsapp_default_message TEXT,
    delivery_charge_inside NUMERIC DEFAULT 60,
    delivery_charge_outside NUMERIC DEFAULT 120,
    free_delivery_min_order NUMERIC DEFAULT 2000,
    announcement_text TEXT,
    is_announcement_active BOOLEAN DEFAULT true,
    is_live_chat_active BOOLEAN DEFAULT true,
    bdcourier_api_key TEXT,
    pathao_client_id TEXT,
    pathao_client_secret TEXT,
    pathao_username TEXT,
    pathao_password TEXT,
    pathao_store_id INTEGER,
    steadfast_api_key TEXT,
    steadfast_secret_key TEXT,
    tracking_fb_pixel_id TEXT,
    tracking_fb_capi_token TEXT,
    tracking_gtm_id TEXT,
    tracking_ga4_id TEXT,
    tracking_tiktok_pixel_id TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. app_orders
CREATE TABLE IF NOT EXISTS public.app_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    district TEXT NOT NULL DEFAULT 'Dhaka',
    subtotal NUMERIC DEFAULT 0,
    delivery_charge NUMERIC DEFAULT 0,
    discount_amount NUMERIC DEFAULT 0,
    grand_total NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending',
    courier_ratio_data JSONB,
    pathao_consignment_id TEXT,
    steadfast_consignment_id TEXT,
    steadfast_tracking_code TEXT,
    note TEXT,
    assigned_to TEXT,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. app_order_items
CREATE TABLE IF NOT EXISTS public.app_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.app_orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.app_products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    selected_variant TEXT,
    quantity INTEGER NOT NULL,
    price NUMERIC NOT NULL
);

-- 6. app_inventory_transactions
CREATE TABLE IF NOT EXISTS public.app_inventory_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.app_products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    transaction_type TEXT NOT NULL,
    reference TEXT,
    created_by TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. app_chats
CREATE TABLE IF NOT EXISTS public.app_chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_id TEXT NOT NULL,
    customer_name TEXT,
    customer_phone TEXT,
    department TEXT DEFAULT 'Support',
    label TEXT DEFAULT 'New',
    status TEXT DEFAULT 'pending',
    agent_id TEXT,
    ip TEXT,
    device TEXT,
    browser TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. app_chat_messages
CREATE TABLE IF NOT EXISTS public.app_chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID REFERENCES public.app_chats(id) ON DELETE CASCADE,
    sender_role TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    body TEXT,
    attachments JSONB DEFAULT '[]',
    is_seen BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. app_landing_pages
CREATE TABLE IF NOT EXISTS public.app_landing_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    product_id UUID REFERENCES public.app_products(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    template_color TEXT DEFAULT '#ff3f60',
    features JSONB DEFAULT '[]',
    testimonials JSONB DEFAULT '[]',
    faq JSONB DEFAULT '[]',
    pixel_id TEXT,
    capi_token TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. app_pages
CREATE TABLE IF NOT EXISTS public.app_pages (
    slug TEXT PRIMARY KEY,
    title_primary TEXT NOT NULL,
    title_secondary TEXT,
    content_primary TEXT NOT NULL,
    content_secondary TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. app_coupons
CREATE TABLE IF NOT EXISTS public.app_coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT DEFAULT 'percent',
    discount_value NUMERIC NOT NULL,
    min_order NUMERIC DEFAULT 0,
    max_uses INTEGER DEFAULT 0,
    used_count INTEGER DEFAULT 0,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true
);

-- 12. app_admin_users
CREATE TABLE IF NOT EXISTS public.app_admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'superadmin',
    permissions TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_app_orders_created_at ON public.app_orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_app_orders_status ON public.app_orders (status);
CREATE INDEX IF NOT EXISTS idx_app_orders_phone ON public.app_orders (phone);
CREATE INDEX IF NOT EXISTS idx_app_products_slug ON public.app_products (slug);
CREATE INDEX IF NOT EXISTS idx_app_landing_pages_slug ON public.app_landing_pages (slug);
CREATE INDEX IF NOT EXISTS idx_app_chats_visitor ON public.app_chats (visitor_id);
CREATE INDEX IF NOT EXISTS idx_app_chat_messages_chat ON public.app_chat_messages (chat_id);
"""

req = urllib.request.Request(
    f'{base_url}/pg/query',
    data=json.dumps({'query': sql}).encode('utf-8'),
    headers={
        'apikey': service_key,
        'Authorization': f'Bearer {service_key}',
        'Content-Type': 'application/json'
    },
    method='POST'
)

try:
    with urllib.request.urlopen(req) as resp:
        print('Tables creation status:', resp.status)
        print('Response:', resp.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print('HTTP Error:', e.code, e.read().decode('utf-8'))
