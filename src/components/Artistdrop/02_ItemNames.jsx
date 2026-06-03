import React, { useState, useEffect } from "react";
import { IoChevronDown } from "react-icons/io5";
import FormInput from "../Global/FormInput"; // ปรับ Path ตามที่คุณเก็บไฟล์ไว้

export default function ItemDetails({ formData, onChange, errors }) {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:7777/api/products/categories",
        );
        const result = await response.json(); // ต้องแปลง response เป็น JSON

        if (result.success) {
          setCategories(result.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Fallback เผื่อ API พัง ให้ใช้ค่าจาก Model Enum
        setCategories(["Visual Art", "Craft & Handmade", "Music & Sound"]);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="bg-white p-8 border border-gray-200 shadow-sm space-y-8 ">
      {/* 1. Item Name - เรียกใช้ FormInput ของคุณได้เลย! */}
      <FormInput
        label="Item Name *"
        name="itemName"
        value={formData.itemName || ""}
        onChange={onChange}
        error={errors.itemName}
        required={true}
        placeholder="e.g. 'Silent Symphony #01'"
      />
      <FormInput
        label="Slug URL *"
        description="A unique URL-friendly name (e.g. silent-symphony-01)"
        name="slug"
        value={formData.slug || ""}
        onChange={onChange}
        error={errors.slug}
        required={true}
        placeholder="e.g. 'silent-symphony-01'"
      />
      <FormInput
        label="Description"
        description="The description will be included on the item's detail page."
        name="description"
        value={formData.description}
        onChange={onChange}
        required={true}
        error={errors.description}
        isTextArea={true} // บอกให้รู้ว่าเป็น Textarea
        placeholder="Provide a detailed description of your item."
      />
      <FormInput
        label="Artist Name *"
        name="artist"
        value={formData.artist || ""}
        onChange={onChange}
        error={errors.artist}
        required={true}
        placeholder="e.g. 'Starchaser'"
      />
      <FormInput
        label="From Artist"
        description="Tell the story behind this work, your inspiration, or your perspective."
        name="fromArtist"
        value={formData.fromArtist || ""}
        onChange={onChange}
        error={errors.fromArtist}
        isTextArea={true}
        placeholder="This block is perfect for a conversational tone that reflects the creator's identity..."
      />

      {/* 4. Category */}
      <div>
        <label className="block text-base font-bold text-black mb-1">
          Category <span className="text-red-500">*</span>{" "}
          {/* [เพิ่มใหม่] ดอกจัน */}
        </label>
        <span className="block text-sm text-gray-500 mb-3">
          Select a category to help users find your item.
        </span>
        <div className="relative">
          <select
            name="category"
            value={formData.category}
            onChange={onChange}
            // [ปรับแก้] เช็คเงื่อนไข errors.category เพื่อเปลี่ยนกรอบเป็นสีแดง
            className={`w-full border p-3 appearance-none outline-none focus:border-black focus:ring-1 focus:ring-black cursor-pointer text-gray-800 ${
              errors.category
                ? "border-red-500 bg-red-50"
                : "border-gray-400 bg-white"
            }`}
          >
            <option value="" disabled hidden>
              Select category
            </option>
            <option value="Visual Art">Visual Art</option>
            <option value="Craft & Handmade">Craft & Handmade</option>
            <option value="Music & Sound">Music & Sound</option>
          </select>
          <IoChevronDown className="absolute right-4 top-[1.1rem] text-gray-600 text-xl pointer-events-none" />
        </div>
        {/* [เพิ่มใหม่] แสดงข้อความ Error ด้านล่าง Dropdown */}
        {errors.category && (
          <p className="text-red-500 text-sm mt-1">{errors.category}</p>
        )}
      </div>
      <FormInput
        label="Tags"
        description="Separate tags with commas (e.g. 3d, visual, art)"
        name="tags"
        value={formData.tags || ""}
        onChange={onChange}
        error={errors.tags}
        placeholder="e.g. '3d, visual, art'"
      />
      {/* 5. Quantity */}
      <FormInput
        label="Quantity"
        description="The number of items that can be minted. No hidden costs."
        type="number"
        name="quantity"
        value={formData.quantity}
        onChange={onChange}
        placeholder="e.g. 1"
      />

      <hr className="border-gray-100" />

      {/* 4. Price - ประยุกต์ UI เดิมแต่ครอบกรอบแดงเมื่อมี Error */}
      <div>
        <label className="block text-base font-bold text-black mb-3">
          Price *
        </label>
        <div
          className={`flex items-center border ${
            errors.price
              ? "border-red-500 focus-within:ring-red-500 bg-red-50"
              : "border-gray-400 focus-within:border-black focus-within:ring-1 focus-within:ring-black"
          }`}
        >
          <span className="pl-4 pr-3 py-3 font-semibold text-black">฿</span>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={onChange}
            placeholder="00"
            step="1"
            className="w-full p-3 outline-none bg-transparent placeholder-gray-400 text-gray-800"
          />
        </div>
        {errors.price && (
          <p className="text-red-500 text-sm mt-1">{errors.price}</p>
        )}
      </div>
    </div>
  );
}
