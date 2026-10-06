import urllib.request
import json

base_url = 'http://supabasekong-k7v0e6lnxjwerisif54rzczl.187.77.131.65.sslip.io'
service_key = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc4MjAzOTkwMCwiZXhwIjo0OTM3NzEzNTAwLCJyb2xlIjoic2VydmljZV9yb2xlIn0.DrdZTVKHvVSgJsJWciIIOyq91lJodQAzUTZ8FCTV7h4'

sql = """
-- 1. Seed app_settings (id=1)
INSERT INTO public.app_settings (
    id, site_name, hotline_number, whatsapp_number, whatsapp_default_message,
    delivery_charge_inside, delivery_charge_outside, free_delivery_min_order,
    announcement_text, is_announcement_active, is_live_chat_active
) VALUES (
    1, 'আল-শিফা কেয়ার (Al-Shifa Care)', '01886367377', '01886367377',
    'হ্যালো, আমি আল-শিফা ন্যাচারাল অয়েল সম্পর্কে জানতে চাই।',
    60, 120, 2000,
    '🌿 সীমিত সময়ের অফার! আজই অর্ডার করুন এবং উপভোগ করুন আকর্ষণীয় ডিসকাউন্ট।',
    true, true
) ON CONFLICT (id) DO UPDATE SET
    site_name = EXCLUDED.site_name,
    hotline_number = EXCLUDED.hotline_number,
    whatsapp_number = EXCLUDED.whatsapp_number;

-- 2. Seed app_admin_users
INSERT INTO public.app_admin_users (
    username, password_hash, role, permissions
) VALUES (
    'admin', 'admin123', 'superadmin',
    ARRAY['dashboard', 'orders', 'products', 'inventory', 'courier', 'inbox', 'landing', 'pages', 'reports', 'users', 'settings']
) ON CONFLICT (username) DO UPDATE SET
    role = 'superadmin',
    permissions = EXCLUDED.permissions;

-- 3. Seed app_categories
INSERT INTO public.app_categories (
    slug, name_primary, name_secondary, icon, sort_order, is_active
) VALUES (
    'herbal-care', 'হারবাল ও প্রাকৃতিক কেয়ার', 'Herbal Care', 'Sparkles', 1, true
) ON CONFLICT (slug) DO NOTHING;

-- 4. Seed app_products
INSERT INTO public.app_products (
    slug, code, name_primary, name_secondary, description, price, original_price,
    stock, images, variants, benefits, tags, is_featured, is_active, sort_order
) VALUES (
    'al-shifa-hair-oil',
    'SHIFA-001',
    'আল-শিফা প্রিমিয়াম হেয়ার অ্যান্ড স্ক্যাল্প কেয়ার অয়েল',
    'Al-Shifa Premium Herbal Oil',
    '১০০% প্রাকৃতিক ও খাঁটি ভেষজ উপাদানে প্রস্তুতকৃত বিশেষ তেল, যা চুল পড়া বন্ধ করতে ও চুলের গভীর পুষ্টি নিশ্চিত করতে সাহায্য করে।',
    950,
    1550,
    250,
    ARRAY['/images/product-main.png'],
    '[{"name": "১ বোতল (ট্রায়াল প্যাক)", "price": 950, "stock": 100}, {"name": "২ বোতল (কম্বো অফার)", "price": 1750, "stock": 100}, {"name": "৩ বোতল (মেগা সেভার)", "price": 2500, "stock": 50}]'::jsonb,
    ARRAY['চুল পড়া বন্ধ করে', 'নতুন চুল গজাতে সাহায্য করে', 'খুশকি ও স্ক্যাল্প ইনফেকশন দূর করে', 'চুল ঝলমলে ও সিল্কি করে'],
    ARRAY['herbal', 'haircare', 'natural'],
    true,
    true,
    1
) ON CONFLICT (slug) DO UPDATE SET
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price;

-- 5. Seed app_landing_pages
INSERT INTO public.app_landing_pages (
    slug, title, subtitle, description, template_color, features, testimonials, faq, is_active
) VALUES (
    'shifa-care',
    'চুল পড়া বন্ধে ১০০% প্রাকৃতিক ও পরীক্ষিত সমাধান',
    'সম্পূর্ণ ভেষজ উপাদানে তৈরি প্রিমিয়াম আল-শিফা কেয়ার অয়েল',
    'কোনো ধরনের ক্ষতিকর কেমিক্যাল ছাড়াই প্রাকৃতিক উপায়ে চুলের ঘনত্ব বৃদ্ধি করুন এবং স্ক্যাল্প সুস্থ রাখুন।',
    '#ff3f60',
    '[
      {"title": "১০০% প্রাকৃতিক উপাদান", "desc": "বিরল ও খাঁটি ভেষজ উপাদান থেকে কোল্ড-প্রেসড পদ্ধতিতে সংগৃহীত।"},
      {"title": "কোনো সাইড ইফেক্ট নেই", "desc": "রাসায়নিক ও কৃত্রিম সুগন্ধিমুক্ত, সম্পূর্ণ নিরাপদ।"},
      {"title": "ক্যাশ অন ডেলিভারি", "desc": "সারাদেশে হোম ডেলিভারি, পণ্য হাতে পেয়ে মূল্য পরিশোধের সুবিধা।"}
    ]'::jsonb,
    '[
      {"name": "মো. রফিকুল ইসলাম", "location": "মিরপুর, ঢাকা", "rating": 5, "review": "আমি ২ সপ্তাহ ধরে ব্যবহার করছি। মাশাআল্লাহ চুল পড়া অনেক কমে গেছে।"},
      {"name": "সুলতানা রহমান", "location": "চট্টগ্রাম", "rating": 5, "review": "খুবই ভালো তেল, চুল সিল্কি হয় এবং মাথার খুশকি চলে গেছে।"},
      {"name": "তানভীর আহমেদ", "location": "সিলেট", "rating": 5, "review": "প্যাকেজিং খুব সুন্দর এবং ডেলিভারিও খুব দ্রুত পেয়েছি। ধন্যবাদ আল-শিফা।"}
    ]'::jsonb,
    '[
      {"q": "তেলটি কীভাবে ব্যবহার করতে হবে?", "a": "সপ্তাহে ৩-৪ দিন রাতে ঘুমানোর আগে স্ক্যাল্পে হালকা ম্যাসাজ করে লাগান এবং সকালে সাধারণ শ্যাম্পু দিয়ে ধুয়ে ফেলুন।"},
      {"q": "কতদিনের মধ্যে ফলাফল পাওয়া যাবে?", "a": "নিয়মিত ব্যবহারে ২ থেকে ৩ সপ্তাহের মধ্যে দৃশ্যমান উন্নতি লক্ষ্য করবেন।"},
      {"q": "ডেলিভারি চার্জ কত?", "a": "ঢাকায় ৬০ টাকা, ঢাকার বাইরে ১২০ টাকা। তবে অফার চলাকালীন আকর্ষণীয় ছাড় প্রযোজ্য।"}
    ]'::jsonb,
    true
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle;

-- 6. Seed app_pages
INSERT INTO public.app_pages (slug, title_primary, title_secondary, content_primary, content_secondary)
VALUES (
    'privacy-policy',
    'গোপনীয়তা নীতি',
    'Privacy Policy',
    'আমরা আমাদের গ্রাহকদের তথ্যের সর্বোচ্চ সুরক্ষা নিশ্চিত করি। আপনার ব্যক্তিগত তথ্য শুধুমাত্র অর্ডার প্রসেসিং এবং ডেলিভারির জন্য ব্যবহৃত হয়।',
    'We ensure the highest standard of privacy for all our valued customers.'
) ON CONFLICT (slug) DO NOTHING;
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
        print('Seed status:', resp.status)
        print('Seed response:', resp.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print('HTTP Error:', e.code, e.read().decode('utf-8'))
