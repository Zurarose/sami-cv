import { Card, CardHeader, CardTitle, CardContent } from '@/ui-kit/basic/card';
import {
  User,
  Mail,
  Phone,
  Globe,
  MapPin,
  Timer,
  PlayIcon,
  Camera,
} from 'lucide-react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/ui-kit/basic/form';
import { Input } from '@/ui-kit/basic/input';
import { UseFormReturn } from 'react-hook-form';
import { DocumentData } from '@/types/document';
import { Textarea } from '@/ui-kit/basic/textarea';
import { useRef } from 'react';

interface PersonalInfoProps {
  form: UseFormReturn<DocumentData, unknown, DocumentData>;
}

export function PersonalInfo({ form }: PersonalInfoProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    // Check file size (3MB = 3 * 1024 * 1024 bytes)
    const maxSize = 3 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File size must be less than 3MB');
      event.target.value = '';
      return;
    }
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      event.target.value = '';
      return;
    }
    // Convert to base64
    const reader = new FileReader();
    reader.onload = e => {
      const base64String = e.target?.result as string;
      form.setValue('photo', base64String);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <User className="h-5 w-5" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="applicantName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Birth Date</FormLabel>
                <FormControl>
                  <Input placeholder="01/01/1990" {...field} type="date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="john@example.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone
                </FormLabel>
                <FormControl>
                  <Input placeholder="+1 (555) 123-4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Website
                </FormLabel>
                <FormControl>
                  <Input placeholder="https://yourwebsite.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Country
                </FormLabel>
                <FormControl>
                  <Input placeholder="United States" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="yearsOfExperience"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Timer className="h-4 w-4" />
                  Years of Experience
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Years of Experience"
                    {...field}
                    type="number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="whenReadyToWork"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <PlayIcon className="h-4 w-4" />
                  When Ready to Work
                </FormLabel>
                <FormControl>
                  <Input placeholder="Immediately" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="certificates"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Certificates</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the certificates if any"
                    className="min-h-[50px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="additionalInfo"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Additional Info</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the additional info if any"
                    className="min-h-[50px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="photo"
            render={() => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Photo
                </FormLabel>
                <FormControl>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="cursor-pointer"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
