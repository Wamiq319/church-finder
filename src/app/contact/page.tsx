"use client";

import { useState } from "react";
import Image from "next/image";
import { Button, Input, Hero } from "@/components";
import content from "@/data/content.json";

export default function ContactPage() {
  const { ContactPage: contactContent } = content;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ name: "", email: "", message: "" });

      // Hide success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className="bg-white">
      <Hero
        title={contactContent.heroTitle}
        subtitle={contactContent.heroSubtitle}
        height="md"
      />

      {/* Contact Form Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A365D] mb-6">
                {contactContent.formTitle}
              </h2>
              <p className="text-lg text-[#444] mb-8">
                {contactContent.formSubtitle}
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-[#7FC242] p-3 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#1A365D]">
                      {contactContent.emailTitle}
                    </h3>
                    <p className="text-[#444]">
                      <a
                        href="mailto:info@churchfinder.com"
                        className="hover:text-[#7FC242]"
                      >
                        info@churchfinder.com
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#7FC242] p-3 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#1A365D]">
                      {contactContent.phoneTitle}
                    </h3>
                    <p className="text-[#444]">
                      <a
                        href="tel:+2341234567890"
                        className="hover:text-[#7FC242]"
                      >
                        +234 123 456 7890
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#7FC242] p-3 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#1A365D]">
                      {contactContent.addressTitle}
                    </h3>
                    <p className="text-[#444]">{contactContent.addressText}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#F9F9F9] p-8 rounded-lg shadow-md">
              {submitSuccess && (
                <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
                  {contactContent.successMessage}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    label={contactContent.nameLabel}
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-6">
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    label={contactContent.emailLabel}
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-6">
                  <Input
                    id="message"
                    name="message"
                    label={contactContent.messageLabel}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  className="w-full py-3 text-base"
                >
                  {isSubmitting
                    ? contactContent.submittingButton
                    : contactContent.submitButton}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-[#F0FAF5] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.952912260219!2d3.375295414266757!3d6.5276316452784755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sLagos!5e0!3m2!1sen!2sng!4v1620000000000!5m2!1sen!2sng"
              width="100%"
              height="450"
              style={{ border: 0 }}
              loading="lazy"
              title="ChurchFinder Location"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}
