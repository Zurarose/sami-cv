import {
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
} from '@/ui-kit/basic/card';

export default function ThankYou() {
  return (
    <div className="relative top-[200px] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Thank You</CardTitle>
          <CardDescription className="text-center">
            Your document has been updated successfully. You can close this
            window now.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
