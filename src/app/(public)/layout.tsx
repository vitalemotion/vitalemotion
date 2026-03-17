import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import CookieConsent from "@/components/layout/CookieConsent";
import CartDrawer from "@/components/store/CartDrawer";
import CartToast from "@/components/store/CartToast";
import { getSiteSettingsContent } from "@/sanity/lib/content";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteSettings = await getSiteSettingsContent();
  const footerServices = siteSettings?.footerServices?.length
    ? siteSettings.footerServices
    : undefined;
  const footerDescription =
    siteSettings?.footerDescription || siteSettings?.description || undefined;
  const footerAddress = [siteSettings?.addressLine1, siteSettings?.addressLine2]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer
        practiceName={siteSettings?.practiceName}
        description={footerDescription}
        services={footerServices}
        contactEmail={siteSettings?.contactEmail || undefined}
        contactPhone={siteSettings?.contactPhone || undefined}
        address={footerAddress || undefined}
        socialInstagram={siteSettings?.socialInstagram || undefined}
        socialFacebook={siteSettings?.socialFacebook || undefined}
        socialLinkedin={siteSettings?.socialLinkedin || undefined}
        copyrightText={siteSettings?.copyrightText || undefined}
      />
      <WhatsAppButton phoneNumber={siteSettings?.whatsappNumber || undefined} />
      <CookieConsent />
      <CartDrawer />
      <CartToast />
    </>
  );
}
