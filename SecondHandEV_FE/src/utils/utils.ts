/* eslint-disable @typescript-eslint/no-unused-vars */
import { MemberDto } from "src/types/user.type";
import imageCompression from "browser-image-compression";

export const getProfileFromLS = () => {
  const result = localStorage.getItem("profile");
  return result ? JSON.parse(result) : null;
};
export const setProfileToLS = (profile: MemberDto | null) => {
  if (profile) {
    localStorage.setItem("profile", JSON.stringify(profile));
  } else {
    localStorage.removeItem("profile");
  }
};

export const formatPrice = (price: number | undefined) => {
  if (!price) return "0₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result as string;
      resolve(base64);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
}

export const compressImage = async (imageFile: File): Promise<File | null> => {
  try {
    const defaultOptions = {
      maxSizeMB: 0.8,
      useWebWorker: true,
      initialQuality: 0.1,
      fileType: "image/jpeg",
      alwaysKeepResolution: true,
    };

    const compressedFile = await imageCompression(imageFile, defaultOptions);

    return compressedFile;
  } catch (error) {
    return null;
  }
};
