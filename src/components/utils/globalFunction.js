import jsPDF from "jspdf";
import { axiosImage } from "../hooks/axiosProvider";

// import React from "react";
// import { Document, Page, pdfjs } from "react-pdf";

const moment = require("moment-timezone");

export const arrayTransform = (data) => {
  if (!Array.isArray(data)) return [];

  return data.map((item) => {
    const emoji = item?.emoji ? item.emoji + " " : "";
    const label = item?.name || item?.first_name || "";

    return {
      value: item?._id || "",
      label: emoji + label,
      emoji: item?.emoji || "",
      dial_code: item?.dial_code || "",
      short_name: item?.short_name || "",
      state_code: item?.state_code || "",
      country_code: item?.country_code || "",
      created_by_users: item?.created_by_users,
    };
  });
};

export const arrayTransform2 = (data) => {
  if (!Array.isArray(data)) return [];

  return data.map((item) => {
    // const emoji = item?.emoji ? item.emoji + " " : "";
    const labelText = item?.name || item?.first_name || "";

    return {
      value: item?._id || "",
      // JSX label with logo + emoji + text
      label: (
        <span className="flex items-center gap-2">
          {item?.logo_url ? (
            <img
              src={item.logo_url || "/36369.jpg"}
              alt="logo"
              className="w-5 h-5 rounded-full border object-cover"
              // onError={(e) => {
              //   e.currentTarget.onerror = null;
              //   e.currentTarget.src = "/36369.jpg";
              // }}
            />
          ) : (
            <img
              src={"/36369.jpg"}
              alt="logo"
              className="w-5 h-5 rounded-full border object-cover"
            />
          )}

          {labelText}
        </span>
      ),
      emoji: item?.emoji || "",
      dial_code: item?.dial_code || "",
      short_name: item?.short_name || "",
      state_code: item?.state_code || "",
      country_code: item?.country_code || "",
      created_by_users: item?.created_by_users,
      logo_url: item?.logo_url || "",
    };
  });
};

export const uploadImageDirectly = async (file, moduleName = "DEFAULT") => {
  if (!file) {
    throw new Error("No file provided");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("module", moduleName);

  try {
    const response = await axiosImage.post("/global-module/upload", formData);
    return response.data;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

export const uploadMultiImageDirectly = async (
  files,
  moduleName = "DEFAULT"
) => {
  if (!files || files.length === 0) {
    throw new Error("No files provided");
  }

  const formData = new FormData();
  for (let file of files) {
    formData.append("file", file); // must match backend field name
  }
  formData.append("module", moduleName);

  try {
    const response = await axiosImage.post(
      "/global-module/upload-multi",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

export const uploadPdfDirectly = async (file, moduleName = "DEFAULT") => {
  if (!file) {
    throw new Error("No file provided");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("module", moduleName);

  try {
    const response = await axiosImage.post(
      "/global-module/upload-doc",
      formData
    );
    return response.data;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

export const uploadVideoDirectly = async (file, moduleName = "DEFAULT") => {
  if (!file) {
    throw new Error("No file provided");
  }

  // If file is a FileList or array, get the first File
  const actualFile = file instanceof File ? file : file[0];

  // console.log("file:------", actualFile);

  const formData = new FormData();
  formData.append("file", actualFile); // Now it's binary
  formData.append("module", moduleName);

  try {
    const response = await axiosImage.post(
      "/global-module/upload-video",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

// export const getDuration = (startDate, endDate) => {
//   // console.log(startDate, endDate);
//   if (!startDate || !endDate) return "";

//   const start = new Date(startDate);
//   const end = new Date(endDate);

//   let years = end.getFullYear() - start.getFullYear();
//   let months = end.getMonth() - start.getMonth();
//   let days = end.getDate() - start.getDate();

//   if (days < 0) {
//     months--;
//     const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
//     days += prevMonth.getDate();
//   }

//   if (months < 0) {
//     years--;
//     months += 12;
//   }

//   if (years < 0) return "Invalid Dates";

//   const yearStr = years > 0 ? `${years} year${years > 1 ? "s" : ""}` : "";
//   const monthStr = months > 0 ? `${months} month${months > 1 ? "s" : ""}` : "";
//   const dayStr = days > 0 ? `${days} day${days > 1 ? "s" : ""}` : "";

//   return [yearStr, monthStr, dayStr].filter(Boolean).join(" ");
// };
export const getDuration = (startDate, endDate) => {
  if (!startDate) return "";

  const start = new Date(startDate);
  const startMonth = start.toLocaleString("default", { month: "short" });
  const startYear = start.getFullYear();

  let end;
  let isPresent = false;

  // If no endDate → treat as "Present"
  if (!endDate) {
    end = new Date(); // current date
    isPresent = true;
  } else {
    end = new Date(endDate);
  }

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  if (years < 0) return "Invalid Dates";

  const yearStr = years > 0 ? `${years} year${years > 1 ? "s" : ""}` : "";
  const monthStr = months > 0 ? `${months} month${months > 1 ? "s" : ""}` : "";
  const dayStr = days > 0 ? `${days} day${days > 1 ? "s" : ""}` : "";
  const durationStr = [yearStr, monthStr, dayStr].filter(Boolean).join(" ");

  const endMonth = end.toLocaleString("default", { month: "short" });
  const endYear = end.getFullYear();

  // Display full formatted range + duration
  const range = isPresent
    ? `${startMonth} ${startYear} - Present`
    : `${startMonth} ${startYear} - ${endMonth} ${endYear}`;

  return durationStr ? `${range} (${durationStr})` : range;
};

export const convertToTimestamp = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.getTime(); // Milliseconds timestamp
};

export const formatDateRange = (startTimestamp, endTimestamp) => {
  if (!startTimestamp || !endTimestamp) return "";

  const startDate = new Date(startTimestamp);
  const endDate = new Date(endTimestamp);

  if (isNaN(startDate) || isNaN(endDate)) return "";

  const options = { year: "numeric", month: "short", day: "2-digit" };
  const formattedStart = startDate.toLocaleDateString("en-US", options);
  const formattedEnd = endDate.toLocaleDateString("en-US", options);

  return `${formattedStart} - ${formattedEnd}`;
};

export const convertTimestampToDate = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0"); // Months are 0-based
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};
export const convertTimestampToDateUI = (timestamp) => {
  if (!timestamp) return "";

  const date = new Date(timestamp);

  const day = date.getDate(); // 1 - 31
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()]; // getMonth() returns 0-11
  const year = date.getFullYear();

  return `${day} ${month}, ${year}`;
};
export const convertTimestampToDate2 = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0"); // Months are 0-based
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${day}-${month}-${year}`;
};

export const convertTimestampToYear = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp * 1000); // <-- multiply by 1000
  const year = date.getFullYear();
  return `${year}`;
};

export const convertTimestampToTime = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const convertTimeToTimestamp2 = (timeStr) => {
  if (!timeStr) return null;

  const [hours, minutes] = timeStr.split(":").map(Number);
  const now = new Date();
  now.setHours(hours);
  now.setMinutes(minutes);
  now.setSeconds(0);
  now.setMilliseconds(0);

  return now.getTime();
};

const generateResumePDF = (data) => {
  try {
    // Input validation
    if (!data) {
      throw new Error("No data provided for resume generation");
    }

    // Check if jsPDF is available
    if (typeof jsPDF === "undefined") {
      throw new Error(
        "jsPDF library is not loaded. Please include jsPDF in your project."
      );
    }

    // console.log("Resume data:", data);

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Color scheme
    const primaryColor = "#2563eb";
    const secondaryColor = "#64748b";
    const textColor = "#1e293b";

    let yPosition = 20;
    const leftMargin = 20;
    const rightMargin = pageWidth - 20;
    const contentWidth = rightMargin - leftMargin;

    // Helper functions
    const addText = (
      text,
      x,
      y,
      fontSize = 10,
      color = textColor,
      fontStyle = "normal"
    ) => {
      if (!text || typeof text !== "string") return;

      try {
        pdf.setFontSize(fontSize);
        pdf.setTextColor(color);
        pdf.setFont("helvetica", fontStyle);
        pdf.text(String(text), x, y);
      } catch (error) {
        console.warn("Error adding text:", error.message);
      }
    };

    const addLine = (x1, y1, x2, y2, color = primaryColor, lineWidth = 0.5) => {
      try {
        pdf.setDrawColor(color);
        pdf.setLineWidth(lineWidth);
        pdf.line(x1, y1, x2, y2);
      } catch (error) {
        console.warn("Error adding line:", error.message);
      }
    };

    const addMultiLineText = (text, x, y, maxWidth, lineHeight = 5) => {
      if (!text || typeof text !== "string") return y;

      try {
        const lines = pdf.splitTextToSize(String(text), maxWidth);
        lines.forEach((line, i) => {
          pdf.text(line, x, y + i * lineHeight);
        });
        return y + lines.length * lineHeight;
      } catch (error) {
        console.warn("Error adding multi-line text:", error.message);
        return y;
      }
    };

    const addSection = (title, contentFunction, yPos) => {
      if (!title) return yPos;

      try {
        // Check if we need a new page
        if (yPos > pageHeight - 40) {
          pdf.addPage();
          yPos = 20;
        }

        addText(
          title.toUpperCase(),
          leftMargin,
          yPos,
          12,
          primaryColor,
          "bold"
        );
        addLine(leftMargin, yPos + 2, rightMargin, yPos + 2, primaryColor);
        yPos += 8;

        if (typeof contentFunction === "function") {
          yPos = contentFunction(yPos);
        }

        return yPos + 5;
      } catch (error) {
        console.warn(`Error adding section "${title}":`, error.message);
        return yPos;
      }
    };

    const formatDate = (timestamp) => {
      if (!timestamp) return "Present";

      try {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) return "Invalid Date";
        return date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
      } catch (error) {
        console.warn("Error formatting date:", error.message);
        return "Invalid Date";
      }
    };

    const checkPageBreak = (requiredSpace = 30) => {
      if (yPosition > pageHeight - requiredSpace) {
        pdf.addPage();
        yPosition = 20;
      }
    };

    // Extract data with safe fallbacks
    const personalInfo = data?.personalInfo || {};
    const experiences = data?.experiences || [];
    const educations = data?.educations || [];
    const projects = data?.projects || [];
    const certifications = data?.certifications || [];
    const topSkills = data?.topSkills?.data || data?.topSkills || [];

    // Header - Personal Information
    const fullName = `${personalInfo?.first_name || ""} ${
      personalInfo?.last_name || ""
    }`.trim();

    if (fullName) {
      addText(fullName, leftMargin, yPosition, 24, primaryColor, "bold");
      yPosition += 10;
    }

    if (personalInfo?.headline) {
      addText(personalInfo.headline, leftMargin, yPosition, 12, secondaryColor);
      yPosition += 6;
    }

    // Contact Information
    const contactInfo = [];
    if (personalInfo?.email) contactInfo.push(`Email: ${personalInfo.email}`);
    if (
      personalInfo?.address?.city?.name &&
      personalInfo?.address?.state?.name
    ) {
      contactInfo.push(
        `Location: ${personalInfo.address.city.name}, ${personalInfo.address.state.name}`
      );
    }
    if (personalInfo?.address?.pin_code)
      contactInfo.push(`PIN: ${personalInfo.address.pin_code}`);

    if (contactInfo.length > 0) {
      contactInfo.forEach((info) => {
        addText(info, leftMargin, yPosition, 10, secondaryColor);
        yPosition += 4;
      });
    }

    // Summary
    if (personalInfo?.summary && personalInfo.summary.trim()) {
      yPosition += 5;
      checkPageBreak();
      yPosition = addSection(
        "Summary",
        (yPos) => {
          return addMultiLineText(
            personalInfo.summary,
            leftMargin,
            yPos,
            contentWidth
          );
        },
        yPosition
      );
    }

    yPosition += 5;

    // Professional Experience
    if (experiences.length > 0) {
      checkPageBreak();
      yPosition = addSection(
        "Professional Experience",
        (yPos) => {
          experiences.forEach((exp, index) => {
            if (index > 0) yPos += 8; // Space between experiences

            // Check for page break before each experience
            if (yPos > pageHeight - 60) {
              pdf.addPage();
              yPos = 20;
            }

            if (exp?.profileName) {
              addText(exp.profileName, leftMargin, yPos, 11, textColor, "bold");
              yPos += 5;
            }

            if (exp?.companyName) {
              addText(
                exp.companyName,
                leftMargin,
                yPos,
                10,
                secondaryColor,
                "bold"
              );
              yPos += 4;
            }

            // Date range
            const startDate = formatDate(exp?.start_date);
            const endDate = exp?.currently_available
              ? "Present"
              : formatDate(exp?.end_date);
            addText(
              `${startDate} - ${endDate}`,
              leftMargin,
              yPos,
              9,
              secondaryColor
            );
            yPos += 4;

            if (exp?.industryName) {
              addText(
                `Industry: ${exp.industryName}`,
                leftMargin,
                yPos,
                9,
                secondaryColor
              );
              yPos += 4;
            }

            if (exp?.description && exp.description.trim()) {
              yPos = addMultiLineText(
                exp.description,
                leftMargin,
                yPos,
                contentWidth
              );
              yPos += 2;
            }

            // Skills acquired
            if (exp?.skills_acquired && exp.skills_acquired.length > 0) {
              const skills = exp.skills_acquired
                .map((skill) => skill?.name)
                .filter(Boolean)
                .join(", ");
              if (skills) {
                addText(
                  `Skills: ${skills}`,
                  leftMargin,
                  yPos,
                  9,
                  secondaryColor
                );
                yPos += 4;
              }
            }
          });
          return yPos;
        },
        yPosition
      );
    }

    // Education
    if (educations.length > 0) {
      checkPageBreak();
      yPosition = addSection(
        "Education",
        (yPos) => {
          educations.forEach((edu, index) => {
            if (index > 0) yPos += 8;

            if (yPos > pageHeight - 50) {
              pdf.addPage();
              yPos = 20;
            }

            if (edu?.degree) {
              addText(edu.degree, leftMargin, yPos, 11, textColor, "bold");
              yPos += 5;
            }

            if (edu?.institution) {
              addText(
                edu.institution,
                leftMargin,
                yPos,
                10,
                secondaryColor,
                "bold"
              );
              yPos += 4;
            }

            if (edu?.field_of_studies) {
              addText(
                `Field of Study: ${edu.field_of_studies}`,
                leftMargin,
                yPos,
                9,
                secondaryColor
              );
              yPos += 4;
            }

            const startDate = formatDate(edu?.start_date);
            const endDate = edu?.currently_available
              ? "Present"
              : formatDate(edu?.end_date);
            addText(
              `${startDate} - ${endDate}`,
              leftMargin,
              yPos,
              9,
              secondaryColor
            );
            yPos += 4;

            if (edu?.skills_acquired && edu.skills_acquired.length > 0) {
              const skills = edu.skills_acquired
                .map((skill) => skill?.name)
                .filter(Boolean)
                .join(", ");
              if (skills) {
                addText(
                  `Skills Acquired: ${skills}`,
                  leftMargin,
                  yPos,
                  9,
                  secondaryColor
                );
                yPos += 4;
              }
            }
          });
          return yPos;
        },
        yPosition
      );
    }

    // Projects
    if (projects.length > 0) {
      checkPageBreak();
      yPosition = addSection(
        "Projects",
        (yPos) => {
          projects.forEach((project, index) => {
            if (index > 0) yPos += 8;

            if (yPos > pageHeight - 50) {
              pdf.addPage();
              yPos = 20;
            }

            if (project?.name) {
              addText(project.name, leftMargin, yPos, 11, textColor, "bold");
              yPos += 5;
            }

            if (project?.company) {
              addText(
                `Company: ${project.company}`,
                leftMargin,
                yPos,
                10,
                secondaryColor
              );
              yPos += 4;
            }

            if (project?.start_date || project?.end_date) {
              const startDate = formatDate(project?.start_date);
              const endDate = formatDate(project?.end_date);
              addText(
                `${startDate} - ${endDate}`,
                leftMargin,
                yPos,
                9,
                secondaryColor
              );
              yPos += 4;
            }

            if (project?.description && project.description.trim()) {
              yPos = addMultiLineText(
                project.description,
                leftMargin,
                yPos,
                contentWidth
              );
              yPos += 4;
            }

            if (
              project?.file_url &&
              project.file_url !== "http://localhost:3000/user/profile"
            ) {
              addText(
                `Project URL: ${project.file_url}`,
                leftMargin,
                yPos,
                9,
                secondaryColor
              );
              yPos += 4;
            }
          });
          return yPos;
        },
        yPosition
      );
    }

    // Certifications
    if (certifications.length > 0) {
      checkPageBreak();
      yPosition = addSection(
        "Certifications",
        (yPos) => {
          certifications.forEach((cert, index) => {
            if (index > 0) yPos += 8;

            if (yPos > pageHeight - 50) {
              pdf.addPage();
              yPos = 20;
            }

            if (cert?.name) {
              addText(cert.name, leftMargin, yPos, 11, textColor, "bold");
              yPos += 5;
            }

            if (cert?.issuing_organization) {
              addText(
                `Issued by: ${cert.issuing_organization}`,
                leftMargin,
                yPos,
                10,
                secondaryColor
              );
              yPos += 4;
            }

            if (cert?.issue_date) {
              addText(
                `Issued: ${formatDate(cert.issue_date)}`,
                leftMargin,
                yPos,
                9,
                secondaryColor
              );
              yPos += 4;
            }

            if (cert?.credential_id) {
              addText(
                `Credential ID: ${cert.credential_id}`,
                leftMargin,
                yPos,
                9,
                secondaryColor
              );
              yPos += 4;
            }

            if (
              cert?.credential_url &&
              cert.credential_url !== "http://localhost:3000/user/profile"
            ) {
              addText(
                `URL: ${cert.credential_url}`,
                leftMargin,
                yPos,
                9,
                secondaryColor
              );
              yPos += 4;
            }

            if (cert?.skills_acquired && cert.skills_acquired.length > 0) {
              const skills = cert.skills_acquired
                .map((skill) => skill?.name)
                .filter(Boolean)
                .join(", ");
              if (skills) {
                addText(
                  `Skills: ${skills}`,
                  leftMargin,
                  yPos,
                  9,
                  secondaryColor
                );
                yPos += 4;
              }
            }
          });
          return yPos;
        },
        yPosition
      );
    }

    // Skills
    if (topSkills.length > 0) {
      checkPageBreak();
      yPosition = addSection(
        "Skills",
        (yPos) => {
          const skillNames = topSkills
            .map((skill) => skill?.skill_name)
            .filter(Boolean)
            .join(", ");

          if (skillNames) {
            yPos = addMultiLineText(skillNames, leftMargin, yPos, contentWidth);
          }

          return yPos;
        },
        yPosition
      );
    }

    // Footer
    const footerY = pageHeight - 10;
    addText("Generated by Verified", leftMargin, footerY, 8, secondaryColor);

    const currentDate = new Date().toLocaleDateString();
    addText(
      `Generated on: ${currentDate}`,
      rightMargin - 50,
      footerY,
      8,
      secondaryColor
    );

    return pdf;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error(`Failed to generate resume PDF: ${error.message}`);
  }
};

const handleResumeDownload = (data) => {
  try {
    if (!data) {
      throw new Error("No data provided for resume generation");
    }

    // Validate that personalInfo exists
    if (!data.personalInfo) {
      throw new Error("Personal information is required to generate resume");
    }

    const pdf = generateResumePDF(data);

    // Create a safe filename
    const firstName = data.personalInfo?.first_name || "Resume";
    const lastName = data.personalInfo?.last_name || "";
    const fileName = `${firstName}_${lastName}_Resume.pdf`
      .replace(/[^a-zA-Z0-9._-]/g, "_") // Replace invalid characters
      .replace(/_{2,}/g, "_") // Replace multiple underscores with single
      .replace(/^_|_$/g, ""); // Remove leading/trailing underscores

    pdf.save(fileName);

    // console.log(`Resume downloaded successfully as: ${fileName}`);
    return true;
  } catch (error) {
    console.error("Error downloading resume:", error);

    // Show user-friendly error message
    if (typeof alert !== "undefined") {
      alert(`Failed to download resume: ${error.message}`);
    }

    return false;
  }
};

const validateResumeData = (data) => {
  const errors = [];

  if (!data) {
    errors.push("No data provided");
    return errors;
  }

  if (!data.personalInfo) {
    errors.push("Personal information is missing");
  } else {
    if (!data.personalInfo.first_name && !data.personalInfo.last_name) {
      errors.push("Name is required");
    }
    if (!data.personalInfo.email) {
      errors.push("Email is required");
    }
  }

  return errors;
};

export { handleResumeDownload, generateResumePDF, validateResumeData };

export const formatDateByMomentTimeZone = (
  timestamp,
  format = "D MMM YYYY"
) => {
  const timezone = moment.tz.guess();
  return moment.tz(timestamp, timezone).format(format);
};

export const momentValueFunc = (value, format) => {
  const timezone = moment.tz.guess();
  const m = format
    ? moment(value, format).tz(timezone)
    : moment(value).tz(timezone);

  return m.startOf("day").valueOf();
};

export const MediaPreview = ({ url, type, onRemove }) => {
  if (!url) return null;

  return (
    <div className="sticky top-0 left-0 mt-2 max-w-xs border p-2 shadow">
      {type === "image" && (
        <img
          src={url}
          alt="Preview"
          className="rounded-lg max-h-40 object-cover"
        />
      )}
      {type === "video" && (
        <video controls className="rounded-lg max-h-40">
          <source src={url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      {type === "pdf" && (
        <div className="flex items-center p-2 glassy-card rounded-lg">
          <span className="mr-2">📄</span>
          <span className="truncate">{url}</span>
        </div>
      )}
      <button
        onClick={onRemove}
        className="absolute -top-2 -right-2 bg-red-500 glassy-text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs"
      >
        ×
      </button>
    </div>
  );
};

// set worker for pdf.js
// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// export default function PdfThumbnail({ fileUrl }) {
//   return (
//     <div className="w-[150px] shadow rounded overflow-hidden">
//       <Document file={fileUrl}>
//         <Page pageNumber={1} width={150} /> {/* show only 1st page as thumbnail */}
//       </Document>
//     </div>
//   );
// }

// let socket = null
let socketNotification = null;
export function capitalizeWords(str = "") {
  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

export const connectNotificationSocket = (userId) => {
  if (!socketNotification.connected) {
    socketNotification.connect();
    socketNotification.emit("notification_connected", { userId }); // Emit the CONNECTED event
  }
};

export const generateHtmlPreview = (mailData, profileData, institution) => {
  console.log("mailData", mailData);
  console.log("profileData", profileData);
  return `
        <html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verification of ${
      mailData?.companyName ? "Experience" : "Institute"
    }</title>
    <style type="text/css">
        body, html {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333333;
            line-height: 1.6;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
            overflow: hidden;
            border: 1px solid #e0e0e0;
        }
        .header {
            background-color: #007bff;
            color: #ffffff;
            padding: 20px;
            text-align: center;
        }
        .content {
            padding: 30px;
            color: #2f2c2c;

        }
        .section-heading {
            font-size: 18px;
            color: #007bff;
            margin-top: 25px;
            margin-bottom: 15px;
            font-weight: bold;
        }
        .detail-item {
            margin-bottom: 12px;
        }
        .detail-label {
            font-weight: bold;
            color: #555555;
        }
        .detail-value {
            color: #333333;
        }
        .button-container {
            text-align: center;
            margin: 30px 0;
        }
        .button {
            display: inline-block;
            padding: 12px 25px;
            font-size: 16px;
            color: #ffffff;
            background-color: #007bff;
            border-radius: 5px;
            text-decoration: none;
            font-weight: bold;
        }
        .footer {
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #888888;
            border-top: 1px solid #eeeeee;
            margin-top: 20px;
        }
        .signature {
            margin-top: 25px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h2>Verification of ${
              mailData.companyName ? "Experience" : "Institute"
            }</h2>
        </div>
        <div class="content">
            <p>Dear ${institution.name},</p>
            <p>I am writing to request verification of my ${
              mailData.companyName ? "Experience" : "Degree"
            } at your esteemed ${
    mailData.companyName || mailData?.institution
  }.</p>
            
            <div class="section-heading">Profile Details</div>
            <div class="detail-item">
                <span class="detail-label">Name:</span> <span class="detail-value">${
                  profileData.first_name
                } ${profileData.last_name}</span>
            </div>

            <div class="detail-item">
                <span class="detail-label">Dates of Association:</span> <span class="detail-value">${convertTimestampToDate(
                  mailData.start_date
                )} to ${
    convertTimestampToDate(mailData?.end_date) || "Present"
  }</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">${
                  mailData.companyName || mailData?.institution
                }</span> <span class="detail-value">:${
    mailData.profileName || mailData?.degree
  }</span>
            </div>

            <p>To facilitate the verification process, you can review my full details </p>

           

            <p>Please let me know if you require any further information from my end to complete this verification. Thank you for your time and assistance.</p>

            <div class="signature">
                <p>Sincerely,</p>
                <p>${profileData.username}</p>
                <p>Email: ${profileData?.email}</p>
            </div>
        </div>
        <div class="footer">
            <p>This is an automated email. Please do not reply directly to this message.</p>
        </div>
    </div>
</body>
</html>
    `;
};
