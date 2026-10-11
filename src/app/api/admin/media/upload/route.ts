import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
]);

const MAX_FILE_SIZE = 12 * 1024 * 1024; // 12 MB

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const altText = (formData.get("alt_text") as string) || "";
    const sectionKey = (formData.get("section_key") as string) || "general";

    if (!file) {
      return NextResponse.json({ error: "ফাইল সিলেক্ট করা হয়নি।" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "ফাইলের আকার সর্বোচ্চ ১২ মেগাবাইট হতে পারে।" },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "শুধুমাত্র ছবি (JPG, PNG, WebP, AVIF, GIF, SVG) আপলোড করা যাবে।" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate safe clean filename & unique storage path
    const originalName = file.name || "image.png";
    const extension = originalName.split(".").pop()?.toLowerCase() || "webp";
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 9);
    const sanitizedBase = originalName
      .substring(0, originalName.lastIndexOf("."))
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 30);
    const storagePath = `landing/${timestamp}_${sanitizedBase}_${randomSuffix}.${extension}`;

    // Upload to landing-assets bucket in Supabase Storage
    const bucketName = "landing-assets";
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("Supabase storage upload error:", uploadError);
      return NextResponse.json(
        { error: "ছবি আপলোড করতে ব্যর্থ হয়েছে: " + uploadError.message },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from(bucketName)
      .getPublicUrl(storagePath);

    const publicUrl = publicUrlData.publicUrl;

    // Record asset in public.app_media_assets
    const { data: assetData, error: dbError } = await supabaseAdmin
      .from("app_media_assets")
      .insert({
        file_name: originalName,
        file_path: storagePath,
        public_url: publicUrl,
        mime_type: file.type,
        file_size: file.size,
        alt_text: altText || originalName,
        section_key: sectionKey,
      })
      .select()
      .single();

    if (dbError) {
      console.warn("Failed to record media asset in DB:", dbError.message);
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      asset: assetData || {
        public_url: publicUrl,
        file_name: originalName,
        file_path: storagePath,
      },
    });
  } catch (error: any) {
    console.error("Media upload exception:", error);
    return NextResponse.json(
      { error: "সার্ভারে ছবি আপলোড প্রক্রিয়া করতে ত্রুটি হয়েছে: " + (error?.message || "") },
      { status: 500 }
    );
  }
}
