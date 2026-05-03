package com.clinic.service;

import com.clinic.entity.Prescription;
import com.clinic.entity.PrescriptionMedicine;
import com.clinic.repository.PrescriptionRepository;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Service
public class PdfService {

    private final PrescriptionRepository repo;
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd-MMM-yyyy, hh:mm a")
            .withZone(ZoneId.systemDefault());

    public PdfService(PrescriptionRepository repo) {
        this.repo = repo;
    }

    public Optional<byte[]> generatePrescriptionPdf(Long prescriptionId) {
        return repo.findById(prescriptionId).map(this::renderPdf);
    }

    private byte[] renderPdf(Prescription rx) {
        String html = buildHtml(rx);

        try (ByteArrayOutputStream os = new ByteArrayOutputStream()) {
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.useFastMode();
            builder.withHtmlContent(html, null);
            builder.toStream(os);
            builder.run();
            return os.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF", e);
        }
    }

    private String buildHtml(Prescription rx) {
        String createdDate = rx.getCreatedAt() != null
                ? DATE_FMT.format(rx.getCreatedAt())
                : "N/A";

        StringBuilder medRows = new StringBuilder();
        int idx = 1;
        for (PrescriptionMedicine m : rx.getMedicines()) {
            medRows.append("<tr>")
                    .append("<td style='text-align:center;'>").append(idx++).append("</td>")
                    .append("<td style='font-weight:bold;'>").append(esc(m.getTabletName())).append("</td>")
                    .append("<td style='text-align:center;'>").append(m.isBreakfast() ? "&#10003;" : "&#10007;").append("</td>")
                    .append("<td style='text-align:center;'>").append(m.isLunch() ? "&#10003;" : "&#10007;").append("</td>")
                    .append("<td style='text-align:center;'>").append(m.isDinner() ? "&#10003;" : "&#10007;").append("</td>")
                    .append("<td style='text-align:center;'>").append(m.getFoodInstruction().name().replace("_", " ")).append("</td>")
                    .append("<td style='text-align:center;'>").append(m.getDurationDays()).append(" days</td>")
                    .append("</tr>\n");
        }

        return "<?xml version='1.0' encoding='UTF-8'?>\n" +
                "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Strict//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'>\n" +
                "<html xmlns='http://www.w3.org/1999/xhtml'>\n" +
                "<head>\n" +
                "<style>\n" +
                "body { font-family: sans-serif; font-size: 11pt; color: #1a1a1a; margin: 0; padding: 20px; }\n" +
                ".header { background-color: #1e40af; color: #ffffff; padding: 18px 24px; border-radius: 8px; margin-bottom: 20px; }\n" +
                ".header h1 { margin: 0 0 4px 0; font-size: 18pt; letter-spacing: 0.5px; }\n" +
                ".header p { margin: 2px 0; font-size: 9pt; opacity: 0.9; }\n" +
                ".rx-symbol { font-size: 24pt; font-weight: bold; color: #1e40af; margin: 12px 0 6px 0; }\n" +
                ".section { margin-bottom: 14px; }\n" +
                ".section-title { font-size: 10pt; font-weight: bold; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; border-bottom: 2px solid #e5e7eb; padding-bottom: 3px; }\n" +
                ".info-grid { display: block; }\n" +
                ".info-row { margin-bottom: 4px; }\n" +
                ".info-label { font-size: 9pt; color: #6b7280; font-weight: bold; }\n" +
                ".info-value { font-size: 10pt; color: #111827; font-weight: bold; }\n" +
                "table { width: 100%; border-collapse: collapse; margin-top: 8px; }\n" +
                "th { background-color: #f3f4f6; border: 1px solid #d1d5db; padding: 8px 10px; font-size: 9pt; text-transform: uppercase; letter-spacing: 0.5px; color: #374151; text-align: left; }\n" +
                "td { border: 1px solid #d1d5db; padding: 7px 10px; font-size: 10pt; }\n" +
                "tr:nth-child(even) td { background-color: #f9fafb; }\n" +
                ".advice-box { background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 12px 16px; margin-top: 10px; }\n" +
                ".advice-box h3 { margin: 0 0 6px 0; font-size: 10pt; color: #1e40af; }\n" +
                ".advice-box p { margin: 0; font-size: 10pt; line-height: 1.5; }\n" +
                ".footer { margin-top: 30px; border-top: 2px solid #e5e7eb; padding-top: 14px; }\n" +
                ".signature { text-align: right; margin-top: 40px; }\n" +
                ".signature .name { font-size: 12pt; font-weight: bold; color: #111827; }\n" +
                ".signature .reg { font-size: 9pt; color: #6b7280; }\n" +
                ".watermark { text-align: center; font-size: 8pt; color: #9ca3af; margin-top: 20px; }\n" +
                "</style>\n" +
                "</head>\n" +
                "<body>\n" +
                "<!-- HEADER -->\n" +
                "<div class='header'>\n" +
                "  <h1>" + esc(rx.getClinicName()) + "</h1>\n" +
                "  <p>" + esc(rx.getHospitalName()) + "</p>\n" +
                "  <p>Date: " + createdDate + "</p>\n" +
                "</div>\n" +
                "\n" +
                "<!-- DOCTOR INFO -->\n" +
                "<div class='section'>\n" +
                "  <div class='section-title'>Prescribing Doctor</div>\n" +
                "  <div class='info-grid'>\n" +
                "    <div class='info-row'><span class='info-label'>Name: </span><span class='info-value'>" + esc(rx.getDoctorName()) + "</span></div>\n" +
                "    <div class='info-row'><span class='info-label'>Registration No: </span><span class='info-value'>" + esc(rx.getDoctorRegistrationNo()) + "</span></div>\n" +
                "  </div>\n" +
                "</div>\n" +
                "\n" +
                "<!-- PATIENT INFO -->\n" +
                "<div class='section'>\n" +
                "  <div class='section-title'>Patient Information</div>\n" +
                "  <div class='info-grid'>\n" +
                "    <div class='info-row'><span class='info-label'>Name: </span><span class='info-value'>" + esc(rx.getPatientName()) + "</span></div>\n" +
                "    <div class='info-row'><span class='info-label'>Age: </span><span class='info-value'>" + rx.getAge() + " years</span>" +
                "    <span style='margin-left:20px;'><span class='info-label'>Weight: </span><span class='info-value'>" + rx.getWeight() + " kg</span></span>" +
                "    <span style='margin-left:20px;'><span class='info-label'>Gender: </span><span class='info-value'>" + rx.getGender().name() + "</span></span></div>\n" +
                "  </div>\n" +
                "</div>\n" +
                "\n" +
                "<!-- DIAGNOSIS -->\n" +
                "<div class='section'>\n" +
                "  <div class='section-title'>Diagnosis</div>\n" +
                "  <p style='margin:4px 0; font-size:10pt;'>" + esc(rx.getDiagnosis()) + "</p>\n" +
                "</div>\n" +
                "\n" +
                "<!-- PRESCRIPTION SYMBOL -->\n" +
                "<div class='rx-symbol'>&#8478;</div>\n" +
                "\n" +
                "<!-- MEDICINES TABLE -->\n" +
                "<div class='section'>\n" +
                "  <div class='section-title'>Medicines</div>\n" +
                "  <table>\n" +
                "    <thead>\n" +
                "      <tr>\n" +
                "        <th style='width:5%; text-align:center;'>#</th>\n" +
                "        <th style='width:28%;'>Tablet</th>\n" +
                "        <th style='width:10%; text-align:center;'>Breakfast</th>\n" +
                "        <th style='width:10%; text-align:center;'>Lunch</th>\n" +
                "        <th style='width:10%; text-align:center;'>Dinner</th>\n" +
                "        <th style='width:18%; text-align:center;'>Food</th>\n" +
                "        <th style='width:14%; text-align:center;'>Duration</th>\n" +
                "      </tr>\n" +
                "    </thead>\n" +
                "    <tbody>\n" +
                medRows.toString() +
                "    </tbody>\n" +
                "  </table>\n" +
                "</div>\n" +
                "\n" +
                (rx.getTestRecommendations() != null && !rx.getTestRecommendations().isBlank()
                        ? "<div class='section'>\n  <div class='section-title'>Test Recommendations</div>\n  <p style='margin:4px 0; font-size:10pt;'>" + esc(rx.getTestRecommendations()) + "</p>\n</div>\n"
                        : "") +
                "\n" +
                "<!-- DOCTOR ADVICE -->\n" +
                "<div class='advice-box'>\n" +
                "  <h3>Doctor's Advice</h3>\n" +
                "  <p>" + esc(rx.getDoctorAdvice()) + "</p>\n" +
                "</div>\n" +
                "\n" +
                "<!-- SIGNATURE -->\n" +
                "<div class='footer'>\n" +
                "  <div class='signature'>\n" +
                "    <div class='name'>" + esc(rx.getDoctorName()) + "</div>\n" +
                "    <div class='reg'>Reg. No: " + esc(rx.getDoctorRegistrationNo()) + "</div>\n" +
                "  </div>\n" +
                "</div>\n" +
                "\n" +
                "<div class='watermark'>Generated by Digital Clinic Management System</div>\n" +
                "\n" +
                "</body>\n" +
                "</html>";
    }

    private String esc(String s) {
        if (s == null) return "";
        return s.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}
