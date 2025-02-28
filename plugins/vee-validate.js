import { defineRule, configure } from "vee-validate";
import { required, min, email } from "@vee-validate/rules";
import { localize, setLocale } from "@vee-validate/i18n";
import zhTW from "@vee-validate/i18n/dist/locale/zh_TW.json";

export default defineNuxtPlugin((nuxtApp) => {
  defineRule("required", required);
  defineRule("email", email);
  defineRule("min", min);

  // 自訂驗證規則
  defineRule("isPhone", (value) => {
    const phoneNumberRegex = /^(09)[0-9]{8}$/;
    return phoneNumberRegex.test(value) ? true : "需要正確的電話號碼";
  });
  defineRule("username", (value) => {
    const regex = /^[a-zA-Z\u4e00-\u9fff]{2,}$/;
    return (
      regex.test(value) ||
      "使用者名稱只能包含字母或中文，且至少需要兩個字元"
    );
  });
  defineRule("password", (value) => {
    if (!value) {
      return "密碼為必填項目";
    }
    if (value.length < 8) {
      return "密碼需至少 8 碼以上";
    }
    const hasLetter = /[a-zA-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    if (!hasLetter || !hasNumber) {
      return "密碼必須包含字母和數字";
    }
    return true;
  });
  defineRule("greaterThanZero", (value) => {
    if (value <= 0) {
      return "數值必須大於 0";
    }
    return true;
  });

  // 設定多國語系與驗證訊息
  configure({
    // 載入繁體中文的設定檔，產生繁體中文的驗證訊息
    generateMessage: localize({ zh_TW: zhTW }), 
    validateOnInput: true, // 輸入文字時立即進行驗證
  });
  
  // 設定預設語言為繁體中文
  setLocale("zh_TW");
});