const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const statsRouter = express.Router();

// Extract username from LeetCode URL
const extractLeetCodeUsername = (url) => {
    if (!url) return null;
    const match = url.match(/leetcode\.com\/(?:u\/)?([^\/]+)/);
    return match ? match[1] : null;
};

// Extract username from GitHub URL
const extractGitHubUsername = (url) => {
    if (!url) return null;
    const match = url.match(/github\.com\/([^\/]+)/);
    return match ? match[1] : null;
};

// Fetch LeetCode stats using GraphQL API
statsRouter.get('/leetcode-stats/:userId', authMiddleware, async (req, res) => {
    try {
        const User = require('../model/User');
        const user = await User.findById(req.params.userId);
        
        if (!user || !user.leetcodeLink) {
            return res.status(404).json({ error: 'LeetCode link not found' });
        }
        
        const username = extractLeetCodeUsername(user.leetcodeLink);
        if (!username) {
            return res.status(400).json({ error: 'Invalid LeetCode username' });
        }
        
        // Try multiple APIs
        let data = null;
        
        // API 1: LeetCode GraphQL
        try {
            const query = {
                query: `
                    query getUserStats($username: String!) {
                        matchedUser(username: $username) {
                            username
                            submitStats: submitStatsGlobal {
                                acSubmissionNum {
                                    difficulty
                                    count
                                }
                            }
                            profile {
                                ranking
                                reputation
                            }
                        }
                        allQuestionsCount {
                            difficulty
                            count
                        }
                    }
                `,
                variables: { username }
            };
            
            const response = await fetch('https://leetcode.com/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Referer': 'https://leetcode.com'
                },
                body: JSON.stringify(query)
            });
            
            if (response.ok) {
                const result = await response.json();
                if (result.data && result.data.matchedUser) {
                    const userStats = result.data.matchedUser;
                    const allQuestions = result.data.allQuestionsCount || [];
                    const submissions = userStats.submitStats.acSubmissionNum;
                    
                    data = {
                        username: userStats.username,
                        ranking: userStats.profile?.ranking || 'N/A',
                        totalSolved: submissions.find(s => s.difficulty === "All")?.count || 0,
                        easySolved: submissions.find(s => s.difficulty === "Easy")?.count || 0,
                        mediumSolved: submissions.find(s => s.difficulty === "Medium")?.count || 0,
                        hardSolved: submissions.find(s => s.difficulty === "Hard")?.count || 0,
                        totalQuestions: allQuestions.find(q => q.difficulty === "All")?.count || 0,
                        totalEasy: allQuestions.find(q => q.difficulty === "Easy")?.count || 0,
                        totalMedium: allQuestions.find(q => q.difficulty === "Medium")?.count || 0,
                        totalHard: allQuestions.find(q => q.difficulty === "Hard")?.count || 0,
                        acceptanceRate: 0,
                        contributionPoints: userStats.profile?.reputation || 0
                    };
                }
            }
        } catch (err) {
            console.log('GraphQL API failed, trying alternative...');
        }
        
        // API 2: Alternative API
        if (!data) {
            try {
                const altResponse = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);
                if (altResponse.ok) {
                    const altData = await altResponse.json();
                    if (altData && altData.status === "success") {
                        data = {
                            username: username,
                            ranking: altData.ranking || 'N/A',
                            totalSolved: altData.totalSolved || 0,
                            easySolved: altData.easySolved || 0,
                            mediumSolved: altData.mediumSolved || 0,
                            hardSolved: altData.hardSolved || 0,
                            totalQuestions: altData.totalQuestions || 0,
                            totalEasy: altData.totalEasy || 0,
                            totalMedium: altData.totalMedium || 0,
                            totalHard: altData.totalHard || 0,
                            acceptanceRate: altData.acceptanceRate || 0,
                            contributionPoints: 0
                        };
                    }
                }
            } catch (err) {
                console.log('Alternative API also failed');
            }
        }
        
        if (!data) {
            return res.status(404).json({ error: 'Unable to fetch LeetCode stats' });
        }
        
        res.json(data);
        
    } catch (error) {
        console.error('Error fetching LeetCode stats:', error.message);
        res.status(500).json({ error: 'Failed to fetch LeetCode stats' });
    }
});

// Fetch GitHub stats
statsRouter.get('/github-stats/:userId', authMiddleware, async (req, res) => {
    try {
        const User = require('../model/User');
        const user = await User.findById(req.params.userId);
        
        if (!user || !user.githubLink) {
            return res.status(404).json({ error: 'GitHub link not found' });
        }
        
        const username = extractGitHubUsername(user.githubLink);
        if (!username) {
            return res.status(400).json({ error: 'Invalid GitHub username' });
        }
        
        // Fetch user data
        const userResponse = await fetch(`https://api.github.com/users/${username}`);
        
        if (!userResponse.ok) {
            throw new Error(`HTTP ${userResponse.status}`);
        }
        
        const userData = await userResponse.json();
        
        // Fetch repos to calculate total stars and forks
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
        const reposData = await reposResponse.json();
        
        const repos = reposData;
        const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
        const totalForks = repos.reduce((sum, repo) => sum + (repo.forks_count || 0), 0);
        const totalCommits = await getTotalCommits(username);
        
        res.json({
            login: userData.login,
            name: userData.name,
            avatar_url: userData.avatar_url,
            bio: userData.bio,
            public_repos: userData.public_repos,
            followers: userData.followers,
            following: userData.following,
            totalStars: totalStars,
            totalForks: totalForks,
            totalCommits: totalCommits,
            created_at: userData.created_at,
            updated_at: userData.updated_at
        });
    } catch (error) {
        console.error('Error fetching GitHub stats:', error.message);
        if (error.message.includes('404')) {
            res.status(404).json({ error: 'GitHub user not found' });
        } else {
            res.status(500).json({ error: 'Failed to fetch GitHub stats' });
        }
    }
});

// Helper function to get total commits
async function getTotalCommits(username) {
    try {
        const eventsResponse = await fetch(`https://api.github.com/users/${username}/events/public`);
        const eventsData = await eventsResponse.json();
        const pushEvents = eventsData.filter(event => event.type === 'PushEvent');
        const totalCommits = pushEvents.reduce((sum, event) => sum + (event.payload.commits?.length || 0), 0);
        return totalCommits;
    } catch (error) {
        return 0;
    }
}

module.exports = statsRouter;