import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import useEmblaCarousel from "embla-carousel-react";

interface Testimonial {
  id: string;
  name: string;
  message: string;
  type: string;
  created_at: string;
}

export const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    
    // Auto-scroll every 5 seconds
    const interval = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0);
      }
    }, 5000);
    
    return () => {
      emblaApi.off("select", onSelect);
      clearInterval(interval);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data } = await supabase
        .from('feedback')
        .select('*')
        //.eq('type', 'testimonial')//
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(12);
      
      setTestimonials(data || []);
      setLoading(false);
    };

    fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <section className="section-padding bg-secondary/30">
        <div className="container-custom flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="section-padding bg-secondary/30">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6">
            What Our Members Say
          </h2>
          <p className="text-lg text-muted-foreground">
            Hear from students who have been part of our journey towards sustainable development.
          </p>
        </motion.div>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
                >
                  <div className="relative p-6 rounded-2xl bg-card border border-border hover:border-primary/20 transition-colors duration-300 h-full">
                    <Quote className="h-8 w-8 text-primary/20 mb-4" />
                    <p className="text-foreground mb-6 leading-relaxed line-clamp-4">
                      "{testimonial.message}"
                    </p>
                    <div className="border-t border-border pt-4">
                      <p className="font-display font-semibold text-foreground">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-muted-foreground">ASAC Member</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {testimonials.length > 3 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="icon"
                onClick={scrollPrev}
                className="rounded-full"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={scrollNext}
                className="rounded-full"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
