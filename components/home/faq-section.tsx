import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTranslations } from "next-intl";

// Sample FAQ data - replace with your own questions and answers

export default function FAQSection() {
  const t = useTranslations("link");

  const faqData = [
    {
      question: t("question1"),
      answer: t("answer1"),
    },
    {
      question: t("question2"),
      answer: t("answer2"),
    },
    {
      question: t("question3"),
      answer: t("answer3"),
    },
    {
      question: t("question4"),
      answer: t("answer4"),
    },
    {
      question: t("question5"),
      answer: t("answer5"),
    },
    {
      question: t("question6"),
      answer: t("answer6"),
    },
  ];
  return (
    <section className="flex h-auto w-full max-w-6xl flex-col items-center justify-center space-y-16 p-4 pb-16 sm:p-16 lg:pb-32">
      <div className="mb-10 text-center">
        <h2 className="text-primary text-xl font-bold lg:text-2xl xl:text-4xl">{t("faqSectionTitle")}</h2>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {faqData.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left xl:text-2xl">{faq.question}</AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground xl:text-2xl">{faq.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
