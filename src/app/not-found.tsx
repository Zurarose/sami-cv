import Link from 'next/link';
import { Button } from '@/ui-kit/basic/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui-kit/basic/card';
import { Badge } from '@/ui-kit/basic/badge';
import { Home, ArrowLeft } from 'lucide-react';
import { routes } from '@/constant/routes';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Main Card */}
        <Card className="text-center shadow-xl border-2 border-muted/20">
          <CardHeader className="pb-8">
            {/* 404 Badge */}
            <div className="flex justify-center mb-4">
              <Badge
                variant="outline"
                className="text-2xl font-bold px-6 py-3 rounded-full"
              >
                404
              </Badge>
            </div>

            {/* Main Title */}
            <CardTitle className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Page Not Found
            </CardTitle>

            {/* Description */}
            <CardDescription className="text-lg md:text-xl text-muted-foreground max-w-md mx-auto leading-relaxed">
              Oops! The page you&apos;re looking for seems to have wandered off
              into the digital void.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="min-w-40">
                <Link href={routes.documents}>
                  <Home className="mr-2" />
                  Go to Home
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg" className="min-w-40">
                <Link href="javascript:history.back()">
                  <ArrowLeft className="mr-2" />
                  Go Back
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
