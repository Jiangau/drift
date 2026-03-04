


def topEmotions(resultDict, attr):
    if not resultDict: return []
    emotions = getattr(resultDict, attr, [])
    sortedDict = sorted(emotions, key=lambda x:x.score, reverse=True)
    return [{"name":y.name, "score": y.score} for y in sortedDict[:3]]

def topResult(result):
    if not result: return []
    
    temp = result[0]
    try:
        fileResult = temp.results.predictions[0].models
    except (IndexError, AttributeError):
        return []
        
    finalOutput = []
    modelData = None


    if fileResult.prosody and fileResult.prosody.grouped_predictions:
        modelData = fileResult.prosody.grouped_predictions[0].predictions[0]
        finalOutput = topEmotions(modelData, "emotions")
    elif fileResult.burst and fileResult.burst.grouped_predictions:
        modelData = fileResult.burst.grouped_predictions[0].predictions[0]
        finalOutput = topEmotions(modelData, "descriptions")
    
    return finalOutput