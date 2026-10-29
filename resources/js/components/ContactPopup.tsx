import { useState } from "react";
import { router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  X,
  Send,
  User,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  CheckCircle,
  Rocket,
  FileText,
} from "lucide-react";

interface ContactPopupProps {
  open: boolean;
  onClose: () => void;
}

export default function ContactPopup({ open, onClose }: ContactPopupProps) {
  const { toast } = useToast();

  /* ================= LOGO & DATA ================= */
  const [formData, setFormData] = useState({
    name_en: "",
    email: "",
    telephone: "",
    address: "",
    productService: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const steps = [
    {
      icon: CheckCircle,
      title: "Contact Us",
      desc: "Fill out the form to schedule a personalized consultation.",
    },
    {
      icon: Rocket,
      title: "Project Kickoff",
      desc: "Sign the contract and start your project with our expert team.",
    },
    {
      icon: FileText,
      title: "Get A Quotation",
      desc: "Receive a detailed proposal with cost and timeline estimates.",
    },
  ];

  /* ================= LOGIC ================= */
  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name_en.trim()) newErrors.name_en = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email";
    }
    if (!formData.telephone.trim()) newErrors.telephone = "Phone is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);

    // Note: Ensure the route 'contact.store' exists in your Ziggy/Laravel setup
    router.post(route("contact.store"), formData, {
      onSuccess: () => {
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({
          event: "form_submission_success",
          form_name: "contact_popup",
          form_status: "success",
        });
        setSubmitted(true);
        setErrors({});
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to send.", variant: "destructive" });
      },
      onFinish: () => setIsSubmitting(false),
    });
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row max-h-[95vh] md:max-h-[90vh] overflow-y-auto md:overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/10 md:bg-white/10 text-white md:text-primary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ── LEFT PANEL ── */}
        <div
          className="w-full md:w-[42%] p-6 md:p-8 flex flex-col justify-between text-white shrink-0"
          style={{ background: "linear-gradient(135deg, #D83377 0%, #D83377 100%)" }}
        >
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold leading-snug">
              Let's Spark A Conversation
            </h2>
            <div className="space-y-4">
              {steps.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-3">
                  <Icon className="w-5 h-5 mt-0.5 flex-shrink-0 text-white/70" />
                  <div>
                    <p className="font-semibold text-sm">{title}</p>
                    <p className="text-xs text-white/80">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 flex items-center gap-2 text-sm text-white/80">
            <Phone className="w-4 h-4" />
            <span>03-5633-7776</span>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="flex-1 p-6 md:p-8 bg-white overflow-y-auto">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
              <Button onClick={onClose} variant="outline" className="mt-4">Close</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-semibold mb-2">Send us a message</h3>

              <div className="space-y-3">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                    <User className="w-3 h-3" /> Full Name
                  </label>
                  <Input
                    name="name_en"
                    value={formData.name_en}
                    onChange={handleChange}
                    placeholder="Enter name"
                    className="border-0 border-b rounded-none focus-visible:ring-0 px-0 h-9"
                  />
                  {errors.name_en && <p className="text-red-500 text-[10px]">{errors.name_en}</p>}
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                    <Mail className="w-3 h-3" /> Email
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className="border-0 border-b rounded-none focus-visible:ring-0 px-0 h-9"
                  />
                  {errors.email && <p className="text-red-500 text-[10px]">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Phone
                  </label>
                  <Input
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    placeholder="Phone number"
                    className="border-0 border-b rounded-none focus-visible:ring-0 px-0 h-9"
                  />
                </div>

                {/* Details */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" /> Project Details
                  </label>
                  <Textarea
                    name="productService"
                    value={formData.productService}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    rows={2}
                    className="border-0 border-b rounded-none focus-visible:ring-0 px-0 resize-none min-h-[60px]"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full rounded-xl py-6" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Request"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}