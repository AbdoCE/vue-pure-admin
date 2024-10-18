import { $t } from "@/plugins/i18n";

const operates = [
  {
    title: $t("login.purePhoneLogin")
  },
  {
    title: $t("login.pureQRCodeLogin")
  },
  {
    title: $t("login.pureRegister")
  }
];

const thirdParty = [
  {
    title: $t("login.pureGoogleLogin"),
    icon: "google"
  }
];

export { operates, thirdParty };
