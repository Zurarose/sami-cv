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
import { useCallback, useRef } from 'react';
import {
  ACCEPTED_IMAGE_FILE_TYPES,
  MAX_PHOTO_FILE_BYTES,
} from '@/constant/common';

/** Browsers often omit MIME type; allow common image extensions as fallback. */
const IMAGE_FILENAME = /\.(jpe?g|png|gif|webp|bmp|heic|heif|svg)$/i;

function isImageFile(file: File): boolean {
  if (file.type.startsWith('image/')) return true;
  if (!file.type && IMAGE_FILENAME.test(file.name)) return true;
  return false;
}

interface PersonalInfoProps {
  form: UseFormReturn<DocumentData, unknown, DocumentData>;
}

export function PersonalInfo({ form }: PersonalInfoProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  /** Ignore stale FileReader results when the user picks another file before load finishes. */
  const photoLoadIdRef = useRef(0);

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const input = event.target;
      const file = input.files?.[0];
      if (!file) return;

      const resetInput = () => {
        input.value = '';
      };

      if (file.size > MAX_PHOTO_FILE_BYTES) {
        alert('File size must be less than 3MB');
        resetInput();
        return;
      }
      if (!isImageFile(file)) {
        alert('Please select an image file');
        resetInput();
        return;
      }

      const loadId = ++photoLoadIdRef.current;
      const reader = new FileReader();

      reader.onerror = () => {
        if (loadId !== photoLoadIdRef.current) return;
        alert('Could not read this file. Try another image.');
        resetInput();
      };

      reader.onload = e => {
        if (loadId !== photoLoadIdRef.current) return;
        const base64String = e.target?.result;
        if (
          typeof base64String !== 'string' ||
          !base64String.startsWith('data:image')
        ) {
          alert('Invalid image data. Please try another file.');
          resetInput();
          return;
        }
        form.setValue('photo', base64String, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
      };

      reader.readAsDataURL(file);
    },
    [form]
  );

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
                    accept={ACCEPTED_IMAGE_FILE_TYPES.join(',')}
                    onClick={e => {
                      // Allow choosing the same file again (onChange only fires when the value changes).
                      e.currentTarget.value = '';
                    }}
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
