import Result from "../models/resultModel.js";

export async function createResult(req, res){
    try {
        if(!req.user || !req.user._id){ 
            return res.status(401).json({
                success: false, 
                message: 'Unauthorized Access'
            });
        }
        const { title, technology, level, totalQuestions, correct, wrong } = req.body;
        if( !technology || !level || totalQuestions == undefined || correct == undefined){
            return res.status(400).json({
                success: false,
                message: 'All Fields are Required'
            });
        }
        //compute wrong if not provided
        const computedWrong = wrong !== undefined ? Number(wrong) : Math.max(0, Number(totalQuestions) - Number(correct));
        if(!title){
            return res.status(400).json({
                success: false,
                message: 'Title is Required'
            });
        }
        const payload = {
        title: String(title).trim(),
        technology,
        level,
        totalQuestions: Number(totalQuestions),
        correct: Number(correct),
        wrong: computedWrong,
        user: req.user._id //specific user                                                               
        };

        const created = await Result.create(payload);
        return res.status(201).json({
            success: true,
            message: 'Result Saved Successfully!',
            result: created
        });
        



    } catch (err) {
        console.error('Error saving result:', err);
        return res.status(500).json({
            success: false,
            message: 'Server Error'
        });

    }
}

//list results for specific user
export async function listResults(req, res){
    try {   
        if(!req.user || !req.user._id){
            return res.status(401).json({
                success: false, 
                message: 'Unauthorized Access'
            });
        }   
        const {technology} = req.query;
        const query = { user: req.user._id };
        if(technology && technology.toLowerCase() !== 'all'){ 
            query.technology = technology;
        }
        const items = await Result.find(query).sort({createdAt: -1}).lean();
        
        return res.json({
            success: true,
            results: items
        });



    } catch (err) {
        console.error('Error listing results:', err);
        return res.status(500).json({
            success: false,
            message: 'Server Error'
        });

    }
}