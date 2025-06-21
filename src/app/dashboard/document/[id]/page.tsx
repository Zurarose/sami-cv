import { generateDocumentEditLink, getDocument } from '@/actions/document';
import { routes } from '@/constant/routes';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui-kit/basic/card';
import { Avatar, AvatarFallback } from '@/ui-kit/basic/avatar';
import { Badge } from '@/ui-kit/basic/badge';
import {
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  Building,
  GraduationCap,
} from 'lucide-react';
import { LinkButton } from '@/components/document/link-button';
import { DocumentData } from '@/types/document';

type Params = Promise<{ id: string }>;

export default async function Document({ params }: { params: Params }) {
  const { id } = await params;
  if (!id) redirect(routes.documents);
  const [document, editLink] = await Promise.all([
    getDocument(id),
    generateDocumentEditLink(id),
  ]);
  const data = document?.data as unknown as DocumentData;

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header Section */}
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg font-semibold">
                {data.applicantName
                  ?.split(' ')
                  .map(n => n[0])
                  .join('')
                  .toUpperCase() || 'UN'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <CardTitle className="text-2xl font-bold">
                {data.applicantName || 'Unknown Name'}
              </CardTitle>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {data.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    <span>{data.email}</span>
                  </div>
                )}
                {data.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    <span>{data.phone}</span>
                  </div>
                )}
                {data.website && (
                  <div className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    <a
                      href={data.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {data.website}
                    </a>
                  </div>
                )}
                {data.country && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{data.country}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 mt-4">
                <LinkButton link={editLink} />
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Skills Section */}
        {data.skills && data.skills.length > 0 && (
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Experience & Education Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Experience Section */}
          {data.experiences && data.experiences.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.experiences.map((exp, index) => (
                  <div
                    key={index}
                    className="border-l-2 border-primary/20 pl-4 pb-4 last:pb-0"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-base">
                        {exp.position}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {exp.startDate} - {exp.endDate}
                        </span>
                      </div>
                    </div>
                    <p className="font-medium text-sm text-muted-foreground mb-2">
                      {exp.companyName}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Education Section */}
          {data.education && data.education.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.education.map((edu, index) => (
                  <div
                    key={index}
                    className="border-l-2 border-primary/20 pl-4 pb-4 last:pb-0"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-base">{edu.degree}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {edu.startDate} - {edu.endDate}
                        </span>
                      </div>
                    </div>
                    <p className="font-medium text-sm text-muted-foreground">
                      {edu.schoolName}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
