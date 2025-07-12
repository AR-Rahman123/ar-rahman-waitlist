import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { X, ArrowRight, ArrowLeft, Send, Check } from "lucide-react";

const waitlistSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  role: z.string().optional(),
  age: z.string().optional(),
  prayerFrequency: z.string().optional(),
  arabicUnderstanding: z.string().optional(),
  understandingDifficulty: z.string().optional(),
  importance: z.string().optional(),
  learningStruggle: z.string().optional(),
  arInterest: z.string().optional(),
  features: z.array(z.string()).optional(),
  likelihood: z.string().optional(),
  additionalFeedback: z.string().optional(),
  interviewWillingness: z.string().optional(),
  investorPresentation: z.string().optional(),
});

type WaitlistFormData = z.infer<typeof waitlistSchema>;

interface WaitlistFormProps {
  onClose: () => void;
}

export function WaitlistForm({ onClose }: WaitlistFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const totalSteps = 13;

  const form = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      fullName: "",
      email: "",
      role: "",
      features: [],
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: WaitlistFormData) => {
      const response = await apiRequest("POST", "/api/waitlist", data);
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ['/api/waitlist/count'] });
      toast({
        title: "Success!",
        description: "You've been added to the waitlist. Check your email for confirmation.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to join waitlist. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFeatureChange = (feature: string, checked: boolean) => {
    let newFeatures = [...selectedFeatures];
    if (checked) {
      if (newFeatures.length >= 3) {
        toast({
          title: "Limit reached",
          description: "Please select up to 3 features only.",
          variant: "destructive",
        });
        return;
      }
      newFeatures.push(feature);
    } else {
      newFeatures = newFeatures.filter(f => f !== feature);
    }
    setSelectedFeatures(newFeatures);
    form.setValue("features", newFeatures);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: WaitlistFormData) => {
    submitMutation.mutate(data);
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-spiritual-emerald rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="text-white text-3xl" />
            </div>
            <h3 className="text-3xl font-bold text-spiritual-dark mb-4">BarakAllahu feekum! بارك الله فيكم</h3>
            <p className="text-xl text-gray-600 mb-8">
              Thank you for joining our waitlist. You'll receive a confirmation email shortly, and we'll keep you updated on our progress.
            </p>
            <div className="bg-spiritual-light p-6 rounded-lg mb-6">
              <p className="text-gray-700">
                Watch your inbox for updates and early access opportunities
              </p>
            </div>
            <Button onClick={onClose} className="bg-spiritual-blue hover:bg-blue-800">
              Close
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardContent className="p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">Progress</span>
              <span className="text-sm font-medium text-spiritual-blue">
                Step {currentStep} of {totalSteps}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-spiritual-dark mb-6">Join Our Waitlist</h3>
                  <p className="text-gray-600 mb-8">Tell us a bit about yourself to get started</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      {...form.register("fullName")}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...form.register("email")}
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role/Occupation</Label>
                    <Input
                      id="role"
                      {...form.register("role")}
                      placeholder="e.g., Student, Teacher, Engineer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Age */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-spiritual-dark mb-4">What is your age?</h3>
                  <p className="text-gray-600 mb-8">Help us understand our community demographics</p>
                </div>
                
                <RadioGroup
                  value={form.watch("age")}
                  onValueChange={(value) => form.setValue("age", value)}
                >
                  {["18-25", "26-35", "36-45", "46-55", "56-65", "65+"].map((age) => (
                    <div key={age} className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value={age} id={age} />
                      <Label htmlFor={age} className="flex-1 cursor-pointer">{age}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Step 3: Prayer Frequency */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-spiritual-dark mb-4">How often do you pray Salah?</h3>
                  <p className="text-gray-600 mb-8">Understanding your prayer routine helps us design better features</p>
                </div>
                
                <RadioGroup
                  value={form.watch("prayerFrequency")}
                  onValueChange={(value) => form.setValue("prayerFrequency", value)}
                >
                  {[
                    { value: "5_times_daily", label: "5 times daily" },
                    { value: "3_4_times_daily", label: "3-4 times daily" },
                    { value: "1_2_times_daily", label: "1-2 times daily" },
                    { value: "weekly", label: "Weekly" },
                    { value: "occasionally", label: "Occasionally" },
                    { value: "rarely", label: "Rarely" },
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className="flex-1 cursor-pointer">{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Step 4: Arabic Understanding */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-spiritual-dark mb-4">How would you rate your understanding of Quranic Arabic?</h3>
                  <p className="text-gray-600 mb-8">This helps us tailor the translation features to your needs</p>
                </div>
                
                <RadioGroup
                  value={form.watch("arabicUnderstanding")}
                  onValueChange={(value) => form.setValue("arabicUnderstanding", value)}
                >
                  {["Fluent", "Good", "Basic", "Very limited", "None"].map((level) => (
                    <div key={level} className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value={level.toLowerCase().replace(" ", "_")} id={level} />
                      <Label htmlFor={level} className="flex-1 cursor-pointer">{level}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Step 5: Understanding Difficulty */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-spiritual-dark mb-4">Have you ever found it difficult to understand the meaning of what you're reciting in prayer?</h3>
                  <p className="text-gray-600 mb-8">Your honest feedback helps us address real challenges</p>
                </div>
                
                <RadioGroup
                  value={form.watch("understandingDifficulty")}
                  onValueChange={(value) => form.setValue("understandingDifficulty", value)}
                >
                  {["Always", "Often", "Sometimes", "Rarely", "Never"].map((frequency) => (
                    <div key={frequency} className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value={frequency.toLowerCase()} id={frequency} />
                      <Label htmlFor={frequency} className="flex-1 cursor-pointer">{frequency}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Step 6: Importance */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-spiritual-dark mb-4">How important is it for you to better understand Quran during prayer?</h3>
                  <p className="text-gray-600 mb-8">This helps us understand your motivation and priorities</p>
                </div>
                
                <RadioGroup
                  value={form.watch("importance")}
                  onValueChange={(value) => form.setValue("importance", value)}
                >
                  {[
                    "Extremely important",
                    "Very important", 
                    "Moderately important",
                    "Slightly important",
                    "Not important"
                  ].map((level) => (
                    <div key={level} className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value={level.toLowerCase().replace(" ", "_")} id={level} />
                      <Label htmlFor={level} className="flex-1 cursor-pointer">{level}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Step 7: Learning Struggles */}
            {currentStep === 7 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-spiritual-dark mb-4">What's your biggest struggle with Islamic learning?</h3>
                  <p className="text-gray-600 mb-8">Understanding common challenges helps us design better solutions</p>
                </div>
                
                <RadioGroup
                  value={form.watch("learningStruggle")}
                  onValueChange={(value) => form.setValue("learningStruggle", value)}
                >
                  {[
                    { value: "understanding_arabic", label: "Understanding Arabic" },
                    { value: "finding_time", label: "Finding time to study" },
                    { value: "lack_resources", label: "Lack of good resources" },
                    { value: "staying_consistent", label: "Staying consistent" },
                    { value: "finding_teachers", label: "Finding qualified teachers" },
                    { value: "theory_to_practice", label: "Connecting theory to practice" },
                    { value: "other", label: "Other" },
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className="flex-1 cursor-pointer">{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Step 8: AR Interest */}
            {currentStep === 8 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-spiritual-dark mb-4">Imagine you had an AR (Augmented Reality) headset that was designed like normal glasses and could be used to enhance your prayer experience, what would this mean to you?</h3>
                  <p className="text-gray-600 mb-8">Help us understand the personal impact this technology could have</p>
                </div>
                
                <RadioGroup
                  value={form.watch("arInterest")}
                  onValueChange={(value) => form.setValue("arInterest", value)}
                >
                  {[
                    { value: "life_changing", label: "Life-changing - it would transform my spiritual practice completely" },
                    { value: "very_meaningful", label: "Very meaningful - it would significantly improve my prayer experience" },
                    { value: "helpful_addition", label: "A helpful addition - it would enhance my understanding" },
                    { value: "interesting_but_cautious", label: "Interesting but I'd be cautious about using technology during prayer" },
                    { value: "prefer_traditional", label: "I prefer traditional prayer methods without technology" },
                    { value: "unsure", label: "I'm unsure how I'd feel about it" }
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className="flex-1 cursor-pointer">{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Step 9: Features */}
            {currentStep === 9 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-spiritual-dark mb-4">Which features would be most valuable to you in an AR Islamic tool?</h3>
                  <p className="text-gray-600 mb-8">Choose up to 3 features that would benefit you most</p>
                </div>
                
                <div className="space-y-3">
                  {[
                    { value: "live_translation", label: "Live Quran translation during prayer" },
                    { value: "pronunciation_guidance", label: "Arabic pronunciation guidance" },
                    { value: "qibla_indicator", label: "Prayer direction (Qibla) indicator" },
                    { value: "prayer_times", label: "Islamic calendar and prayer times" },
                    { value: "hadith_overlay", label: "Hadith and Islamic knowledge overlay" },
                    { value: "tajweed_correction", label: "Tajweed correction" },
                    { value: "history_visualization", label: "Islamic history visualization" },
                    { value: "community_features", label: "Community prayer features" },
                  ].map((feature) => (
                    <div key={feature.value} className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                      <Checkbox
                        id={feature.value}
                        checked={selectedFeatures.includes(feature.value)}
                        onCheckedChange={(checked) => handleFeatureChange(feature.value, checked as boolean)}
                      />
                      <Label htmlFor={feature.value} className="flex-1 cursor-pointer">{feature.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 10: Likelihood */}
            {currentStep === 10 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-spiritual-dark mb-4">If this product were available in the next 12 months, how likely would you be to try it?</h3>
                  <p className="text-gray-600 mb-8">Optional: Help us gauge potential adoption</p>
                </div>
                
                <RadioGroup
                  value={form.watch("likelihood")}
                  onValueChange={(value) => form.setValue("likelihood", value)}
                >
                  {[
                    "Extremely likely",
                    "Very likely",
                    "Moderately likely",
                    "Slightly likely",
                    "Not likely at all"
                  ].map((level) => (
                    <div key={level} className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value={level.toLowerCase().replace(" ", "_")} id={level} />
                      <Label htmlFor={level} className="flex-1 cursor-pointer">{level}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Step 11: Additional Feedback */}
            {currentStep === 11 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-spiritual-dark mb-4">Is there anything else that would make this more useful or appealing to you?</h3>
                  <p className="text-gray-600 mb-8">Optional: Share any additional thoughts or suggestions</p>
                </div>
                
                <Textarea
                  {...form.register("additionalFeedback")}
                  placeholder="Share your thoughts, suggestions, or concerns..."
                  className="min-h-[120px]"
                />
              </div>
            )}

            {/* Step 12: Interview Willingness */}
            {currentStep === 12 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-spiritual-dark mb-4">Would you be willing to be contacted to partake in a more detailed interview to understand your specific requirements?</h3>
                  <p className="text-gray-600 mb-8">Help us build a better product through your insights</p>
                </div>
                
                <RadioGroup
                  value={form.watch("interviewWillingness")}
                  onValueChange={(value) => form.setValue("interviewWillingness", value)}
                >
                  {[
                    { value: "yes_happy_to_help", label: "Yes, I'd be happy to help" },
                    { value: "maybe_timing_dependent", label: "Maybe, depending on timing" },
                    { value: "no_thank_you", label: "No, thank you" },
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className="flex-1 cursor-pointer">{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Step 13: Investor Presentation */}
            {currentStep === 13 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-spiritual-dark mb-4">Would you like to see the Angel investor presentation for this business?</h3>
                  <p className="text-gray-600 mb-8">Final question: Learn more about our vision and progress</p>
                </div>
                
                <RadioGroup
                  value={form.watch("investorPresentation")}
                  onValueChange={(value) => form.setValue("investorPresentation", value)}
                >
                  {[
                    { value: "yes_interested", label: "Yes, I'm interested" },
                    { value: "maybe_later", label: "Maybe later" },
                    { value: "no_thank_you", label: "No, thank you" },
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className="flex-1 cursor-pointer">{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              {currentStep > 1 && (
                <Button
                  type="button"
                  onClick={prevStep}
                  variant="ghost"
                  className="text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
              )}
              <div className="flex-1" />
              {currentStep < totalSteps && (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="bg-spiritual-blue hover:bg-blue-800"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
              {currentStep === totalSteps && (
                <Button
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="bg-spiritual-emerald hover:bg-emerald-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {submitMutation.isPending ? "Submitting..." : "Submit"}
                </Button>
              )}
            </div>
          </form>

          {/* Close Button */}
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
