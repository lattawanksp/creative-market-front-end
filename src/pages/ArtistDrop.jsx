import React, { useState } from "react";
// import Navbar from "../components/Home/00_Navbar";
// import Footer from "../components/Home/08_Footer";
import UploadFiles from "../components/Artistdrop/01_UploadFiles";
import ItemNames from "../components/Artistdrop/02_ItemNames";
import SuccessModal from "../components/Global/SuccessModal";

const ArtistDrop = () => {
  // 1. อัปเดต State รวมให้มีฟิลด์ใหม่ครบถ้วน
  const [formData, setFormData] = useState({
    file: null,
    itemName: "",
    slug: "",
    artist: "",
    tags: "",
    description: "",
    fromArtist: "",
    category: "",
    quantity: 1,
    price: "",
  });

  const [errors, setErrors] = useState({});
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  // ฟังก์ชันจัดการเมื่อพิมพ์ข้อมูล
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ฟังก์ชันจัดการเมื่ออัปโหลดไฟล์
  const handleFileChange = (file) => {
    setFormData((prev) => ({ ...prev, file }));
    if (errors.file) {
      setErrors((prev) => ({ ...prev, file: "" }));
    }
  };

  // 3. ฟังก์ชันตรวจสอบความถูกต้อง (เพิ่มเงื่อนไขเช็ค slug และ artist)
  const validateForm = () => {
    const newErrors = {};

    if (!formData.file) newErrors.file = "Please upload your art file.";
    if (!formData.itemName.trim())
      newErrors.itemName = "Item Name is required.";
    if (!formData.slug.trim()) newErrors.slug = "Slug is required.";
    if (!formData.artist.trim()) newErrors.artist = "Artist Name is required.";
    if (!formData.description.trim())
      newErrors.description = "Description is required.";
    if (!formData.category) newErrors.category = "Please select a category.";

    if (!formData.price) {
      newErrors.price = "Price is required.";
    } else if (Number(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 4. ฟังก์ชัน Submit (เชื่อม API ด้วย FormData)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        // ฟังก์ชันแปลงข้อความขึ้นบรรทัดใหม่เป็น Array
        const formatToParagraphArray = (text) => {
          if (!text) return [];
          return text
            .split("\n")
            .filter((paragraph) => paragraph.trim() !== "");
        };

        // ฟังก์ชันแปลงข้อความ Tags (ที่คั่นด้วยลูกน้ำ) เป็น Array
        const formatTagsToArray = (tagsString) => {
          if (!tagsString) return [];
          return tagsString
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag !== "");
        };

        // สร้าง FormData เพื่อรองรับไฟล์รูปภาพ
        const formSubmitData = new FormData();

        // แนบข้อมูล Text ปกติ
        formSubmitData.append("name", formData.itemName);
        formSubmitData.append("slug", formData.slug); // ส่ง slug
        formSubmitData.append(
          "cartName",
          formData.itemName.replace(/\s+/g, ""),
        );
        formSubmitData.append("artist", formData.artist); // ส่ง artist
        formSubmitData.append("category", formData.category);
        formSubmitData.append("price", Number(formData.price));
        formSubmitData.append("quantity", Number(formData.quantity) || 1);

        // แปลง Array เป็น JSON String ก่อนส่ง
        formSubmitData.append(
          "tags",
          JSON.stringify(formatTagsToArray(formData.tags)),
        ); // ส่ง tags
        formSubmitData.append(
          "description",
          JSON.stringify(formatToParagraphArray(formData.description)),
        );
        formSubmitData.append(
          "fromArtist",
          JSON.stringify(formatToParagraphArray(formData.fromArtist)),
        );

        // แนบไฟล์รูปภาพ
        if (formData.file) {
          formSubmitData.append("image", formData.file);
        }

        // ยิง API ไปหา Backend ที่ Port 7777 (ใช้ FormData ห้ามใส่ Content-Type)
        const response = await fetch("http://localhost:7777/api/products", {
          method: "POST",
          body: formSubmitData,
        });

        const result = await response.json();

        if (result.success) {
          setIsSuccessOpen(true);

          // เคลียร์ค่าในฟอร์มหลังสร้างเสร็จ
          setFormData({
            file: null,
            itemName: "",
            slug: "",
            artist: "",
            tags: "",
            description: "",
            fromArtist: "",
            category: "",
            quantity: 1,
            price: "",
          });
        } else {
          // ถ้าซ้ำ (เช่น slug ซ้ำ) Backend จะพ่น error กลับมา
          alert(
            result.message || "เกิดข้อผิดพลาดในการสร้างสินค้า (Slug อาจซ้ำ)",
          );
        }
      } catch (error) {
        console.error("Error creating product:", error);
        alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
      }
    } else {
      console.log("Validation Failed:", errors);
    }
  };

  return (
    <main className="flex-col max-w-4xl mx-auto px-5 md:px-8 relative">
      <div className="mb-12 mt-12">
        <h1 className="text-5xl font-bold text-black font-['Anuphan',sans-serif]">
          Create New Item
        </h1>
        <p className="text-base text-gray-500 font-['Anuphan',sans-serif]">
          Drop your new art to your collection.
        </p>
      </div>

      <p className="text-base font-bold font-['Anuphan',sans-serif] mb-4">
        Upload File *
      </p>

      <UploadFiles
        selectedFile={formData.file}
        onFileChange={handleFileChange}
        error={errors.file}
      />

      <div className="space-y-8 mt-8"></div>

      {/* ส่งข้อมูล formData และ errors ไปให้ ItemNames */}
      <ItemNames
        formData={formData}
        onChange={handleInputChange}
        errors={errors}
      />

      <div className="space-y-8 mt-8"></div>

      <div className="flex pt-4 pb-4 pl-10 content-end justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-black text-white px-10 py-4 text-sm font-bold tracking-widest hover:bg-gray-800 transition-colors"
        >
          CREATE ITEM
        </button>
      </div>
      <div className="space-y-8 mt-8"></div>

      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        title="Item Created!"
        message="Your new art has been successfully added to your collection."
        buttonText="GO TO MY COLLECTION"
      />
    </main>
  );
};

export default ArtistDrop;
