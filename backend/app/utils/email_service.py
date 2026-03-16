import os
import logging
import requests
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("app.email")

BREVO_API_KEY = os.getenv("BREVO_API_KEY")
BREVO_SENDER_EMAIL = os.getenv("BREVO_SENDER_EMAIL")
BREVO_SENDER_NAME = "TnP Portal"
BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"


def _build_email_html(
    student_name: str,
    job_title: str,
    company: str,
    report: dict,
    description: str = None,
    required_skills: str = None,
    min_cgpa: float = None,
) -> str:
    """Build a styled HTML email body from a student job report."""

    match_pct = int(report["match_percentage"])
    readiness = report["readiness_category"]
    strengths = report["strengths"]
    weaknesses = report["weaknesses"]

    # Color based on match score
    if match_pct >= 70:
        color = "#22c55e"   # green
    elif match_pct >= 40:
        color = "#f59e0b"   # amber
    else:
        color = "#ef4444"   # red

    strengths_html = "".join(f"<li style='margin:4px 0;'>✅ {s}</li>" for s in strengths)
    weaknesses_html = "".join(f"<li style='margin:4px 0;'>📌 {s}</li>" for s in weaknesses)

    # Build job details sub-sections outside f-string (backslashes not allowed inside)
    desc_html = f'<p style="margin:0 0 10px;font-size:14px;color:#374151;line-height:1.6;">{description}</p>' if description else ''
    cgpa_html = f'<p style="margin:0 0 6px;font-size:13px;color:#6b7280;"><strong>Min CGPA:</strong> {min_cgpa}</p>' if min_cgpa else ''
    if required_skills:
        skill_tags = "  ".join(
            f'<span style="display:inline-block;background:#eef2ff;color:#4338ca;'
            f'padding:4px 10px;border-radius:12px;font-size:12px;margin:3px 2px;">'
            f'{s.strip()}</span>'
            for s in required_skills.split(",")
        )
        skills_section = (
            f'<div style="margin:8px 0 0;"><strong style="font-size:13px;color:#6b7280;">'
            f'Required Skills:</strong><div style="margin-top:6px;">{skill_tags}</div></div>'
        )
    else:
        skills_section = ''

    html = f"""
    <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;
                background:#ffffff;border-radius:12px;overflow:hidden;
                border:1px solid #e5e7eb;">

        <!-- Header -->
        <div style="background:linear-gradient(135deg,#1e3a5f,#2563eb);padding:28px 24px;
                    text-align:center;color:#ffffff;">
            <h1 style="margin:0;font-size:22px;">🎯 New Job Alert</h1>
            <p style="margin:8px 0 0;font-size:15px;opacity:0.9;">
                {job_title} at {company}
            </p>
        </div>

        <!-- Job Details -->
        <div style="padding:20px 24px;border-bottom:1px solid #e5e7eb;">
            <h3 style="margin:0 0 10px;color:#1e3a5f;font-size:16px;">📋 Job Details</h3>
            {desc_html}
            {cgpa_html}
            {skills_section}
        </div>

        <!-- Match Score -->
        <div style="text-align:center;padding:24px;">
            <p style="margin:0 0 8px;color:#6b7280;font-size:14px;">
                Hi {student_name}, here's your personalized match:
            </p>
            <div style="display:inline-block;width:100px;height:100px;border-radius:50%;
                        border:6px solid {color};line-height:100px;text-align:center;
                        font-size:32px;font-weight:700;color:{color};">
                {match_pct}%
            </div>
            <p style="margin:8px 0 0;font-size:13px;color:#9ca3af;">
                Readiness: <strong>{readiness}</strong>
            </p>
        </div>

        <!-- Strengths -->
        <div style="padding:0 24px 16px;">
            <h3 style="margin:0 0 8px;color:#16a34a;font-size:15px;">Your Strengths</h3>
            <ul style="list-style:none;padding:0;margin:0;font-size:14px;color:#374151;">
                {strengths_html if strengths_html else "<li>No specific strengths identified for this role yet.</li>"}
            </ul>
        </div>

        <!-- Areas to Improve -->
        <div style="padding:0 24px 24px;">
            <h3 style="margin:0 0 8px;color:#dc2626;font-size:15px;">Skills to Develop</h3>
            <ul style="list-style:none;padding:0;margin:0;font-size:14px;color:#374151;">
                {weaknesses_html if weaknesses_html else "<li>Great coverage — keep building!</li>"}
            </ul>
        </div>

        <!-- Footer -->
        <div style="background:#f9fafb;padding:16px 24px;text-align:center;
                    border-top:1px solid #e5e7eb;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">
                This is an automated match report from your Training &amp; Placement Portal.
            </p>
        </div>
    </div>
    """
    return html


def send_job_match_email(
    to_email: str,
    student_name: str,
    job_title: str,
    company: str,
    report: dict,
    description: str = None,
    required_skills: str = None,
    min_cgpa: float = None,
) -> bool:
    """
    Send a personalized job match email to a student via Brevo.

    Returns True if email was sent successfully, False otherwise.
    """

    if not BREVO_API_KEY:
        logger.warning(
            f"Brevo API key not configured — skipping email to {to_email}. "
            f"Match report: {report['match_percentage']}% for {job_title}"
        )
        return False

    html_content = _build_email_html(
        student_name, job_title, company, report,
        description=description,
        required_skills=required_skills,
        min_cgpa=min_cgpa,
    )

    payload = {
        "sender": {
            "name": BREVO_SENDER_NAME,
            "email": BREVO_SENDER_EMAIL,
        },
        "to": [{"email": to_email, "name": student_name}],
        "subject": f"🎯 New Job: {job_title} at {company} — You're a {int(report['match_percentage'])}% match!",
        "htmlContent": html_content,
    }

    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": BREVO_API_KEY,
    }

    try:
        response = requests.post(BREVO_API_URL, json=payload, headers=headers, timeout=10)

        if response.status_code in (200, 201):
            logger.info(f"Email sent to {to_email} for job '{job_title}'")
            return True
        else:
            logger.error(
                f"Brevo API error ({response.status_code}): {response.text}"
            )
            return False

    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {e}")
        return False
