import express from "express"
import MemberShip from "../Modules/MemberShip.js"
import errorHandling from "../Middlewares/ErrorHandling.js"
const router = express.Router()

router.post("/membership", errorHandling(async (req, res) => {
    const { userId, amount, status, planDuration, dailyLimit, planTitle } = req.body

    if (!userId || !amount || !status) return res.status(400).json({ message: "Some fields missing" })
    const newMembership = await MemberShip.create({
        userId, amount, status, planDuration, dailyLimit, planTitle, todayDownloads: 0, downloadAssetTitle: []
    })
    res.json(newMembership)
}))

router.get("/allMembers", errorHandling(async (req, res) => {
    const getAllMembers = await MemberShip.find().populate("userId")
    if (!getAllMembers) return res.status(404).json({ message: "Not found any members" })
    res.json(getAllMembers)
}))

router.put("/updateDailyDownload/:id", errorHandling(async (req, res) => {
    const { assetTitle } = req.body;

    if (!assetTitle) {
        return res.status(400).json({ message: "Asset title is required" });
    }

    const currentMember = await MemberShip.findById(req.params.id).populate('userId');
    if (!currentMember) return res.status(404).json({ message: "Member not found" });

    const allUserPlans = await MemberShip.find({
        userId: currentMember.userId._id,
        status: "true"
    });

    const todayDate = new Date().toISOString().slice(0, 10);

    // Reset date-related fields if it's a new day
    allUserPlans.forEach(plan => {
        if (plan.downloadsDate !== todayDate) {
            plan.todayDownloads = 0;
            plan.downloadsDate = todayDate;
            plan.downloadAssetTitle = [];
        }
    });

    // Check if asset was already downloaded in any plan
    const alreadyDownloaded = allUserPlans.some(plan =>
        plan.downloadAssetTitle.includes(assetTitle)
    );

    if (!alreadyDownloaded) {
        // Only update the current plan's count and title if not downloaded in any plan
        if (currentMember.todayDownloads >= currentMember.dailyLimit) {
            return res.status(403).json({ message: "Daily download limit reached for this plan" });
        }

        currentMember.downloadAssetTitle.push(assetTitle);
        currentMember.todayDownloads += 1;
        currentMember.downloadsDate = todayDate;
        await currentMember.save();

        return res.status(200).json({ message: "Download allowed and counted." });
    }

    // Asset was already downloaded somewhere, allow download but no count
    return res.status(200).json({ message: "Download allowed (already downloaded before, not counted)." });
}));


router.put("/updateStatus", errorHandling(async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    const member = await MemberShip.findOne({ userId });

    if (!member) return res.status(404).json({ message: "Membership not found" });

    const createdAt = new Date(member.createdAt);
    const expiryDate = new Date(createdAt);
    expiryDate.setDate(expiryDate.getDate() + member.planDuration);

    const isExpired = new Date() > expiryDate;

    if (isExpired && member.status !== "false") {
        member.status = "false";
        await member.save();
    }

    res.status(200).json({ status: member.status });
}));

export default router;