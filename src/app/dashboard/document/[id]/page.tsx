import { generateDocumentEditLink, getDocument } from '@/actions/document';
import { routes } from '@/constant/routes';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui-kit/basic/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui-kit/basic/avatar';
import { Badge } from '@/ui-kit/basic/badge';
import {
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  // Building,
  GraduationCap,
  Briefcase,
  Clock,
  CalendarDays,
  Award,
  FileText,
  Target,
  Database,
  Server,
  CheckCircle,
} from 'lucide-react';
import {
  GeneratePdfButton,
  LinkButton,
} from '@/components/document/action-buttons';
import { DocumentData } from '@/types/document';

type Params = Promise<{ id: string }>;

export default async function Document({ params }: { params: Params }) {
  const { id } = await params;
  if (!id) redirect(routes.documents);
  const [document, editLink] = await Promise.all([
    getDocument(id),
    generateDocumentEditLink(id),
  ]);
  if (!document) redirect(routes.documents);
  const data = document?.data as unknown as DocumentData;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-8 space-y-8">
        {/* Header Section */}
        <Card className="w-full shadow-lg border-0 bg-gradient-to-r from-white to-slate-50/50 relative">
          <div className="absolute top-3 right-3 z-10">
            <span className="text-xs text-muted-foreground whitespace-pre-wrap">
              {`Updated ${new Date(document.updatedAt).toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' })} ${new Date(
                document.updatedAt
              ).toLocaleTimeString('ja-JP', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
                timeZone: 'Asia/Tokyo',
              })} v${document.version}`}
            </span>
          </div>
          <CardHeader className="pb-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              <Avatar className="h-20 w-20 ring-4 ring-primary/10">
                <AvatarImage
                  src={data.photo}
                  alt="Applicant Photo"
                  className="object-cover"
                />
                <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-primary/80 to-primary text-white">
                  {data.applicantName
                    ?.split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase() || 'UN'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-4">
                <div>
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
                    {data.applicantName || 'Unknown Name'}
                  </CardTitle>
                  {data.birthDate && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <CalendarDays className="h-4 w-4" />
                      <span>Born: {data.birthDate}</span>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {data.email && (
                    <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                      <Mail className="h-4 w-4 text-blue-500" />
                      <a
                        href={`mailto:${data.email}`}
                        className="hover:underline"
                      >
                        {data.email}
                      </a>
                    </div>
                  )}
                  {data.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                      <Phone className="h-4 w-4 text-green-500" />
                      <a href={`tel:${data.phone}`} className="hover:underline">
                        {data.phone}
                      </a>
                    </div>
                  )}
                  {data.website && (
                    <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                      <Globe className="h-4 w-4 text-purple-500" />
                      <a
                        href={data.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {data.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                  {data.country && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 text-red-500" />
                      <span>{data.country}</span>
                    </div>
                  )}
                </div>

                {/* Experience Info Row */}
                <div className="flex flex-wrap gap-4 pt-2">
                  {data.yearsOfExperience && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                      <Clock className="h-4 w-4" />
                      <span>{data.yearsOfExperience} years experience</span>
                    </div>
                  )}
                  {data.whenReadyToWork && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                      <Target className="h-4 w-4" />
                      <span>Ready to work: {data.whenReadyToWork}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 pt-4">
                  <LinkButton link={editLink} />
                  {document.version > 1 && (
                    <GeneratePdfButton document={data} />
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left Column - Skills & Additional Info */}
          <div className="xl:col-span-1 space-y-6">
            {/* Skills Section */}
            {data.skills && data.skills.length > 0 && (
              <Card className="shadow-md border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="h-5 w-5 text-amber-500" />
                    Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-gradient-to-r from-slate-100 to-slate-50 hover:from-slate-200 hover:to-slate-100 text-slate-700 font-medium transition-all duration-200"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Certificates Section */}
            {data.certificates && (
              <Card className="shadow-md border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-500" />
                    Certificates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {data.certificates}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Additional Info Section */}
            {data.additionalInfo && (
              <Card className="shadow-md border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-indigo-500" />
                    Additional Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {data.additionalInfo}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Experience, Education & Projects */}
          <div className="xl:col-span-3 space-y-6">
            {/* Experience Section */}
            {/* {data.experiences && data.experiences.length > 0 && (
              <Card className="shadow-md border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Building className="h-6 w-6 text-blue-600" />
                    Professional Experience
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {data.experiences.map((exp, index) => (
                    <div
                      key={index}
                      className="relative border-l-4 border-gradient-to-b from-blue-400 to-blue-600 pl-6 pb-6 last:pb-0"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 mb-3">
                        <div>
                          <h3 className="font-bold text-lg text-slate-900">
                            {exp.position}
                          </h3>
                          <p className="font-semibold text-blue-600 mb-1">
                            {exp.companyName}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground bg-slate-50 px-3 py-1 rounded-full">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {exp.startDate} - {exp.endDate}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )} */}

            {/* Projects Section */}
            {data.projects && data.projects.length > 0 && (
              <Card className="shadow-md border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Briefcase className="h-6 w-6 text-purple-600" />
                    Projects
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {data.projects.map((project, index) => (
                    <div
                      key={index}
                      className="relative border-l-4 border-gradient-to-b from-purple-400 to-purple-600 pl-6 pb-6 last:pb-0"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 mb-3">
                        <div>
                          <h3 className="font-bold text-lg text-slate-900">
                            {project.projectName}
                          </h3>
                          <p className="font-semibold text-purple-600 mb-1">
                            {project.position}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground bg-slate-50 px-3 py-1 rounded-full">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {project.startDate} - {project.endDate}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-slate-600 leading-relaxed mb-4">
                        {project.description}
                      </p>

                      {/* Project Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {project.operationSystem && (
                          <div className="flex items-center gap-2 text-sm">
                            <Server className="h-4 w-4 text-green-500" />
                            <span className="text-muted-foreground">OS:</span>
                            <span className="font-medium">
                              {project.operationSystem}
                            </span>
                          </div>
                        )}
                        {project.database && (
                          <div className="flex items-center gap-2 text-sm">
                            <Database className="h-4 w-4 text-orange-500" />
                            <span className="text-muted-foreground">
                              Database:
                            </span>
                            <span className="font-medium">
                              {project.database}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Project Skills */}
                      {project.skills && project.skills.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-slate-700 mb-2">
                            Technologies:
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {project.skills.map((skill, skillIndex) => (
                              <Badge
                                key={skillIndex}
                                variant="outline"
                                className="text-xs bg-purple-50 text-purple-700 border-purple-200"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Responsibilities */}
                      {project.responsibilities &&
                        project.responsibilities.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-slate-700 mb-2">
                              Key Responsibilities:
                            </h4>
                            <ul className="space-y-1">
                              {project.responsibilities.map(
                                (responsibility, respIndex) => (
                                  <li
                                    key={respIndex}
                                    className="flex items-start gap-2 text-sm text-slate-600"
                                  >
                                    <CheckCircle className="h-3.5 w-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>{responsibility}</span>
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Education Section */}
            {data.education && data.education.length > 0 && (
              <Card className="shadow-md border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <GraduationCap className="h-6 w-6 text-green-600" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {data.education.map((edu, index) => (
                    <div
                      key={index}
                      className="relative border-l-4 border-gradient-to-b from-green-400 to-green-600 pl-6 pb-6 last:pb-0"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 mb-2">
                        <div>
                          <h3 className="font-bold text-lg text-slate-900">
                            {edu.degree}
                          </h3>
                          <p className="font-semibold text-green-600">
                            {edu.schoolName}. {edu.fieldOfStudy}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground bg-slate-50 px-3 py-1 rounded-full">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {edu.startDate} - {edu.endDate || 'Present'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
