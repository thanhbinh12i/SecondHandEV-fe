const GEMINI_API_KEY = "AIzaSyCV2hWThBxqChg2LutmiVC2tUHZZuokfeo";
const API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`;

export interface ProductInfo {
  category: string;
  title: string;
  description: string;
  brand: string;
  model: string;
  year: number;
  condition: string;
  voltage?: number;
  capacityWh?: number;
  ageYears?: number;
  motorPowerW?: number;
  batteryVoltage?: number;
  rangeKm?: number;
  mileageKm?: number;
  frameSize?: string;
}

export interface PriceSuggestion {
  suggestedPrice: number;
  minPrice: number;
  maxPrice: number;
}

export class GeminiPriceService {
  validateProductInfo(productInfo: ProductInfo): {
    isValid: boolean;
    missingFields: string[];
  } {
    const missingFields: string[] = [];

    if (!productInfo.brand) missingFields.push("Hãng");
    if (!productInfo.model) missingFields.push("Model");
    if (!productInfo.year) missingFields.push("Năm sản xuất");
    if (!productInfo.condition) missingFields.push("Tình trạng");

    if (productInfo.category === "Pin xe điện") {
      if (!productInfo.voltage) missingFields.push("Điện áp");
      if (!productInfo.capacityWh) missingFields.push("Dung lượng");
    } else {
      if (!productInfo.motorPowerW) missingFields.push("Công suất động cơ");
      if (!productInfo.batteryVoltage) missingFields.push("Điện áp pin");
      if (!productInfo.rangeKm) missingFields.push("Quãng đường");
    }

    return {
      isValid: missingFields.length === 0,
      missingFields,
    };
  }

  async generatePriceSuggestion(
    productInfo: ProductInfo
  ): Promise<PriceSuggestion> {
    try {
      const prompt = this.buildPrompt(productInfo);
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        if (response.status === 400) {
          throw new Error("API key không hợp lệ hoặc đã hết hạn");
        }
        if (response.status === 429) {
          throw new Error("Đã vượt quá giới hạn API. Vui lòng thử lại sau.");
        }
        throw new Error(
          errorData.error?.message || `Lỗi Gemini API: ${response.status}`
        );
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        throw new Error("Gemini không trả về kết quả. Vui lòng thử lại.");
      }

      console.log("Gemini response:", text);

      const cleanText = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : cleanText);

      return {
        suggestedPrice: parsed.suggestedPrice,
        minPrice: parsed.minPrice,
        maxPrice: parsed.maxPrice,
      };
    } catch (error) {
      console.error("Gemini AI Error:", error);
      throw error;
    }
  }

  private buildPrompt(info: ProductInfo): string {
    if (info.category === "Pin xe điện") {
      return `Định giá pin xe điện tại Việt Nam:

Tiêu đề: ${info.title}
Mô tả: ${info.description || "Không có"}
Hãng: ${info.brand}
Model: ${info.model}
Năm: ${info.year}
Tình trạng: ${info.condition}
Điện áp: ${info.voltage}V
Dung lượng: ${info.capacityWh}Wh
Tuổi: ${info.ageYears || 0} năm

Dựa vào thông tin trên và thị trường Việt Nam, trả về JSON với 3 mức giá (VNĐ):
- suggestedPrice: Giá đề xuất hợp lý
- minPrice: Giá thấp nhất 
- maxPrice: Giá cao nhất

Chỉ trả về JSON, không giải thích:
{"suggestedPrice": , "minPrice": , "maxPrice": }`;
    } else {
      return `Định giá xe điện tại Việt Nam:

Tiêu đề: ${info.title}
Mô tả: ${info.description || "Không có"}
Hãng: ${info.brand}
Model: ${info.model}
Năm: ${info.year}
Tình trạng: ${info.condition}
Công suất: ${info.motorPowerW}W
Điện áp pin: ${info.batteryVoltage}V
Quãng đường: ${info.rangeKm}km
Đã đi: ${info.mileageKm || 0}km
Khung: ${info.frameSize || "Không rõ"}

Dựa vào thông tin trên và thị trường Việt Nam, trả về JSON với 3 mức giá (VNĐ):
- suggestedPrice: Giá đề xuất hợp lý
- minPrice: Giá thấp nhất 
- maxPrice: Giá cao nhất 

Chỉ trả về JSON, không giải thích:
{"suggestedPrice": , "minPrice": , "maxPrice": }`;
    }
  }
}

export const geminiPriceService = new GeminiPriceService();
