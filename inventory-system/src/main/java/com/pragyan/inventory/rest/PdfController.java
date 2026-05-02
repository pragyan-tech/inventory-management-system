package com.pragyan.inventory.rest;

import com.pragyan.inventory.service.PdfService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/pdf")
public class PdfController {

    private final PdfService pdfService;

    public PdfController(PdfService pdfService) {
        this.pdfService = pdfService;
    }

    @GetMapping("/low-stock")
    public void lowStockReport(
            @RequestParam(defaultValue = "10") int threshold,
            HttpServletResponse response
    ) throws IOException {

        String filename = "low-stock-report-" + LocalDate.now() + ".pdf";

        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=\"" + filename + "\"");

        pdfService.generateLowStockReport(response.getOutputStream(), threshold);
    }
}