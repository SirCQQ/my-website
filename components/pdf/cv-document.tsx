import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { CvContent } from "@/lib/content/cv";
import { siteConfig } from "@/lib/site-config";

const BRAND = "#0f9d68";
const MUTED = "#525252";
const BORDER = "#e5e5e5";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Inter",
    color: "#171717",
  },
  name: { fontSize: 22, fontFamily: "Inter", fontWeight: 700 },
  role: { fontSize: 12, color: BRAND, marginTop: 2, fontFamily: "Inter", fontWeight: 700 },
  contactRow: { flexDirection: "row", marginTop: 8, gap: 12 },
  contactItem: { fontSize: 9, color: MUTED },
  summary: { marginTop: 12, lineHeight: 1.5, color: "#262626" },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Inter",
    fontWeight: 700,
    marginTop: 18,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: BRAND,
    borderBottom: `1pt solid ${BORDER}`,
    paddingBottom: 4,
  },
  skillsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  skillPill: {
    fontSize: 9,
    backgroundColor: "#f5f5f5",
    color: "#262626",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 3,
  },
  entry: { marginBottom: 12 },
  entryHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  entryTitle: { fontSize: 11, fontFamily: "Inter", fontWeight: 700 },
  entryCompany: { fontSize: 10, color: MUTED },
  entryPeriod: { fontSize: 9, color: MUTED, textAlign: "right" },
  entryIntro: { marginTop: 3, lineHeight: 1.4, color: "#262626" },
  bullet: { flexDirection: "row", marginTop: 3 },
  bulletMark: { width: 8, color: BRAND },
  bulletText: { flex: 1, lineHeight: 1.4, color: "#262626" },
  stackRow: { flexDirection: "row", flexWrap: "wrap", gap: 4, marginTop: 5 },
  stackPill: { fontSize: 8, color: MUTED },
});

export function CvDocument({ cv, locale }: { cv: CvContent; locale: string }) {
  return (
    <Document
      title={`${siteConfig.name} — CV`}
      author={siteConfig.name}
      language={locale}
    >
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{siteConfig.name}</Text>
        <Text style={styles.role}>Full-Stack Developer</Text>
        <View style={styles.contactRow}>
          <Text style={styles.contactItem}>{siteConfig.email}</Text>
          <Text style={styles.contactItem}>{siteConfig.location}</Text>
          <Text style={styles.contactItem}>{siteConfig.url}</Text>
          {siteConfig.links.linkedin ? (
            <Text style={styles.contactItem}>{siteConfig.links.linkedin}</Text>
          ) : null}
        </View>
        <Text style={styles.summary}>{cv.summary}</Text>

        <Text style={styles.sectionTitle}>Core Skills</Text>
        <View style={styles.skillsRow}>
          {cv.coreSkills.map((skill) => (
            <Text key={skill} style={styles.skillPill}>
              {skill}
            </Text>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Experience</Text>
        {cv.experience.map((job) => (
          <View key={`${job.company}-${job.period}`} style={styles.entry} wrap={false}>
            <View style={styles.entryHeaderRow}>
              <View>
                <Text style={styles.entryTitle}>{job.title}</Text>
                <Text style={styles.entryCompany}>
                  {job.company} · {job.location}
                </Text>
              </View>
              <Text style={styles.entryPeriod}>{job.period}</Text>
            </View>
            <Text style={styles.entryIntro}>{job.intro}</Text>
            {job.highlights.map((highlight) => (
              <View key={highlight} style={styles.bullet}>
                <Text style={styles.bulletMark}>—</Text>
                <Text style={styles.bulletText}>{highlight}</Text>
              </View>
            ))}
            <View style={styles.stackRow}>
              {job.stack.map((tech, index) => (
                <Text key={tech} style={styles.stackPill}>
                  {tech}
                  {index < job.stack.length - 1 ? " ·" : ""}
                </Text>
              ))}
            </View>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Education</Text>
        {cv.education.map((edu) => (
          <View key={`${edu.institution}-${edu.period}`} style={styles.entry}>
            <View style={styles.entryHeaderRow}>
              <View>
                <Text style={styles.entryTitle}>{edu.degree}</Text>
                <Text style={styles.entryCompany}>
                  {edu.institution} · {edu.location}
                </Text>
              </View>
              <Text style={styles.entryPeriod}>{edu.period}</Text>
            </View>
          </View>
        ))}
      </Page>
    </Document>
  );
}
