// Shapes rows for the API. Centralised so a password hash can never leak by
// forgetting to strip it in one of the controllers.
const publicUser = (u) =>
  !u
    ? null
    : {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        emailVerified: u.emailVerified,
        avatarUrl: u.avatarUrl ?? null,
        phone: u.phone ?? null,
        location: u.location ?? null,
        headline: u.headline ?? null,
        bio: u.bio ?? null,
        cvUrl: u.cvUrl ?? null,
        skills: u.skills ? u.skills.split(',').filter(Boolean) : [],
        companyName: u.companyName ?? null,
        companyWebsite: u.companyWebsite ?? null,
        companySize: u.companySize ?? null,
        companyAbout: u.companyAbout ?? null,
        verificationStatus: u.verificationStatus,
        verificationNote: u.verificationNote ?? null,
        createdAt: u.createdAt,
      };

// A limited view of another user, shown on a job card / applicant row.
const miniUser = (u) =>
  !u
    ? null
    : {
        id: u.id,
        name: u.name,
        avatarUrl: u.avatarUrl ?? null,
        headline: u.headline ?? null,
        location: u.location ?? null,
        companyName: u.companyName ?? null,
        verificationStatus: u.verificationStatus,
      };

const publicJob = (j, { isFavorite = false, hasApplied = false } = {}) =>
  !j
    ? null
    : {
        id: j.id,
        title: j.title,
        description: j.description,
        category: j.category,
        location: j.location,
        employmentType: j.employmentType,
        workMode: j.workMode,
        experienceMin: j.experienceMin,
        experienceMax: j.experienceMax ?? null,
        salaryMin: j.salaryMin ?? null,
        salaryMax: j.salaryMax ?? null,
        currency: j.currency,
        skills: j.skills ? j.skills.split(',').filter(Boolean) : [],
        status: j.status,
        views: j.views ?? 0,
        providerId: j.providerId,
        provider: miniUser(j.provider),
        applicationsCount: j._count?.applications ?? undefined,
        createdAt: j.createdAt,
        updatedAt: j.updatedAt,
        isFavorite,
        hasApplied,
      };

const publicApplication = (a) =>
  !a
    ? null
    : {
        id: a.id,
        status: a.status,
        coverLetter: a.coverLetter,
        cvUrl: a.cvUrl ?? null,
        jobId: a.jobId,
        workerId: a.workerId,
        job: a.job ? publicJob(a.job) : undefined,
        worker: a.worker ? miniUser(a.worker) : undefined,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      };

const publicMessage = (m) =>
  !m
    ? null
    : {
        id: m.id,
        conversationId: m.conversationId,
        senderId: m.senderId,
        body: m.body,
        attachment: m.attachmentUrl
          ? {
              url: m.attachmentUrl,
              name: m.attachmentName,
              type: m.attachmentType,
              size: m.attachmentSize,
            }
          : null,
        readAt: m.readAt ?? null,
        createdAt: m.createdAt,
        sender: m.sender ? miniUser(m.sender) : undefined,
      };

const publicConversation = (c, viewerId) => {
  if (!c) return null;
  // "The other side" depends on who is looking, so the UI never has to work
  // out which participant to display.
  const other = c.workerId === viewerId ? c.provider : c.worker;
  return {
    id: c.id,
    jobId: c.jobId,
    job: c.job ? { id: c.job.id, title: c.job.title, status: c.job.status } : undefined,
    workerId: c.workerId,
    providerId: c.providerId,
    withUser: miniUser(other),
    lastMessage: c.messages?.[0] ? publicMessage(c.messages[0]) : null,
    unread: c._count?.messages ?? 0,
    lastMessageAt: c.lastMessageAt,
    createdAt: c.createdAt,
  };
};

export { publicUser, miniUser, publicJob, publicApplication, publicMessage, publicConversation };
