import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const reports = [
  { id: 1, name: "Weekly Hydraulic Performance", date: "Oct 24, 2023", size: "2.4 MB" },
  { id: 2, name: "Dam Safety Inspection Audit", date: "Oct 20, 2023", size: "14.1 MB" },
  { id: 3, name: "Q3 Power Generation Summary", date: "Oct 01, 2023", size: "1.8 MB" },
  { id: 4, name: "Transient Analysis Logs - Surge Tank A", date: "Sep 28, 2023", size: "890 KB" },
];

export default function Reports() {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Reports Center</h2>
          <p className="text-muted-foreground mt-2">
            Access generated PDF reports and system audits.
          </p>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Recent Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {reports.map((report) => (
              <div key={report.id} className="flex items-center justify-between py-4 group">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">{report.name}</h3>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {report.date}
                      </span>
                      <span>{report.size}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
