import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SeverityBadge } from "./SeverityBadge";
import { AdvisoryData } from "./AdvisoryForm";
import { Mail, Calendar, Shield, User, AlertTriangle, ExternalLink } from "lucide-react";
import ltimLogo from "@/assets/ltimindtree-official-logo.svg";
import { getCurrentMascot, getCurrentDateIST } from "@/utils/mascotHelper";

interface AdvisoryPreviewProps {
  advisories: AdvisoryData[];
}

export function AdvisoryPreview({ advisories }: AdvisoryPreviewProps) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const currentMascot = getCurrentMascot();
  const currentDateIST = getCurrentDateIST();

  const generateOverallSummary = () => {
    const criticalCount = advisories.filter(a => a.severity === "critical").length;
    const highCount = advisories.filter(a => a.severity === "high").length;
    const mediumCount = advisories.filter(a => a.severity === "medium").length;

    const threatNames = advisories.map(a => a.name).filter(Boolean);

    let severityText = "";
    const severityCounts = [];
    if (criticalCount > 0) severityCounts.push(`${criticalCount} classified as critical`);
    if (highCount > 0) severityCounts.push(`${highCount} as high`);
    if (mediumCount > 0) severityCounts.push(`${mediumCount} as medium`);

    if (severityCounts.length > 0) {
      severityText = ` including ${severityCounts.join(" and ")}`;
    }

    return `Today's ${currentMascot.name} ${currentMascot.description} advisory reports ${advisories.length} threat${advisories.length > 1 ? 's' : ''} identified across global landscapes${severityText}${threatNames.length > 0 ? `\nKey Threat${threatNames.length > 1 ? 's' : ''}:\n ${threatNames.join(" ")}` : ''}`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Email Header with Mascot */}
      <Card className="card-corporate">
        <CardHeader className="bg-gradient-to-r from-primary to-primary-hover text-white rounded-t-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <img src={ltimLogo} alt="LTIMindtree" className="w-12 h-12 bg-white p-2 rounded" />
              <div>
                <CardTitle className="text-xl font-bold">LTIMindtree Threat Intelligence Advisory</CardTitle>
                <p className="text-sm opacity-90">Corporate Security Team</p>
              </div>
            </div>
          </div>

          {/* Mascot Section */}
          <div className="flex items-center gap-4 bg-white/10 rounded-lg p-4">
            <img
              src={currentMascot.image}
              alt={`${currentMascot.name} ${currentMascot.description}`}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h3 className="text-lg font-semibold">
                {currentMascot.name} {currentMascot.emoji}
              </h3>
              <p className="text-sm opacity-90">{currentMascot.description}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="prose max-w-none">
            <p className="text-sm text-muted-foreground mb-4">
              Hello Team,
            </p>
            <p className="text-sm leading-relaxed mb-4">
              Please find below the Daily Threat Advisory from the Corporate Security Team. This report highlights key cybersecurity threats, vulnerabilities, and risks identified across global landscapes. We aim to keep you informed and prepared by providing timely insights into emerging security challenges.
            </p>

            <div className="bg-muted/30 p-6 border-l-4 border-accent rounded-lg">
              <h3 className="text-xl font-bold text-primary mb-4">
                Overall Summary
              </h3>
              <div className="text-foreground leading-relaxed">
                <p className="mb-4">
                  Today's <strong><u>{currentMascot.name}: {currentMascot.description}</u></strong> advisory reports {advisories.length} threat{advisories.length > 1 ? 's' : ''} identified across global landscapes{
                    (() => {
                      const criticalCount = advisories.filter(a => a.severity === "critical").length;
                      const highCount = advisories.filter(a => a.severity === "high").length;
                      const mediumCount = advisories.filter(a => a.severity === "medium").length;
                      const severityCounts = [];
                      if (criticalCount > 0) severityCounts.push(`${criticalCount} classified as critical`);
                      if (highCount > 0) severityCounts.push(`${highCount} as high`);
                      if (mediumCount > 0) severityCounts.push(`${mediumCount} as medium`);
                      return severityCounts.length > 0 ? ` including ${severityCounts.join(" and ")}` : '';
                    })()
                  }
                </p>
                {advisories.filter(a => a.name).length > 0 && (
                  <div>
                    <p className="mb-2">Key Threat{advisories.filter(a => a.name).length > 1 ? 's' : ''}:<br></br></p>
                    <div className="flex flex-wrap gap-2">
                      {advisories.filter(a => a.name).map((advisory, index) => {
                        const getSeverityColor = (severity: string) => {
                          const colors = {
                            critical: 'bg-red-500',
                            high: 'bg-orange-500',
                            medium: 'bg-yellow-500',
                            low: 'bg-blue-500',
                            informational: 'bg-gray-500'
                          };
                          return colors[severity as keyof typeof colors] || colors.informational;
                        };

                        return (
                          <div key={index} className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-sm ${getSeverityColor(advisory.severity)}`}></div>
                            <span className="text-orange-500 font-medium">{advisory.name}</span><br />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Threat Advisories */}
      {advisories.map((advisory, index) => {
        const getSeverityColor = (severity: string) => {
          const colors = {
            critical: 'text-red-600',
            high: 'text-orange-600',
            medium: 'text-yellow-600',
            low: 'text-blue-600',
            informational: 'text-gray-600'
          };
          return colors[severity as keyof typeof colors] || colors.informational;
        };

        return (
          <Card key={advisory.id} className="card-corporate animate-slide-up" style={{ animationDelay: `${(index + 1) * 200}ms` }}>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold mb-2 text-orange-500">
                    {advisory.name ? (
                      <a
                        href={advisory.readMoreLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {advisory.name}
                      </a>
                    ) : (
                      `Threat Advisory #${index + 1}`
                    )
                    }
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(advisory.date)}
                    </div>
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {advisory.attackType}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="severity-badge-hover">
                    <SeverityBadge severity={advisory.severity} />
                  </div>
                  {advisory.cvssScore && advisory.cvssScore.toLowerCase() !== "not found" && (
                    <span className="text-xs font-medium px-2 py-1 bg-muted rounded-md">
                      CVSS: {advisory.cvssScore}
                    </span>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {advisory.vulnerability && (
                <div>
                  <h4 className="font-semibold text-primary mb-2">Vulnerability</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{advisory.vulnerability}</p>
                </div>
              )}

              {advisory.summary && (
                <div>
                  <h4 className="font-semibold text-primary mb-2">Summary</h4>
                  <div className="text-sm text-muted-foreground leading-relaxed">
                    {advisory.summary}
                    {advisory.readMoreLink && (
                      <span>
                        {" "}
                        <a
                          href={advisory.readMoreLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-500 hover:text-orange-600 underline inline-flex items-center gap-1 transition-colors"
                        >
                          <u>Read more...</u>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </span>
                    )}
                  </div>
                </div>
              )}

              {(advisory.threatActor || advisory.deliveryMethod) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {advisory.threatActor && (
                    <div>
                      <h4 className="font-semibold text-primary mb-1">Threat Actor</h4>
                      <p className="text-sm text-muted-foreground">{advisory.threatActor}</p>
                    </div>
                  )}
                  {advisory.deliveryMethod && (
                    <div>
                      <h4 className="font-semibold text-primary mb-1">Delivery Method</h4>
                      <p className="text-sm text-muted-foreground">{advisory.deliveryMethod}</p>
                    </div>
                  )}
                </div>
              )}

              {advisory.mitigation && (
                <div>
                  <h4 className="font-semibold text-primary mb-2">Recommended Actions</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{advisory.mitigation}</p>
                </div>
              )}

              {advisory.references && advisory.references.trim() && (
                <div>
                  <h4 className="font-semibold text-primary mb-2">References</h4>
                  <ul className="space-y-1">
                    {advisory.references.split(',').slice(0, 3).map((ref, idx) => {
                      const trimmedRef = ref.trim();
                      if (!trimmedRef) return null;
                      return (
                        <li key={idx}>
                          <a href={trimmedRef} target="_blank" rel="noopener noreferrer"
                            className="text-sm text-orange-500 hover:text-orange-600 underline break-all inline-flex items-center gap-1 transition-colors">
                            {trimmedRef}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      {/* Footer */}
      <Card className="card-corporate animate-fade-in-delay">
        <CardContent className="py-6 bg-muted/30">
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground font-medium">
              This is an internal LTIMindtree Threat Intel Advisory. Do not share externally.<br />
              IoCs are being tracked in the GSOC excel sheet.
            </p>
            <p className="text-base text-primary font-semibold">
              Regards<br />Corporate Security Team
            </p>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-hover text-white px-6 py-3 rounded-lg font-semibold">
              {currentMascot.name} • <span>{currentMascot.tagline}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}