declare var Student: any
declare var Auth: any

function unlockProductCards (products: [String]) {
    /// #if DEBUG
    console.log(products)
    /// #endif

    for (let product of products){
        Auth.userData.hasAccessTo.push({_id: product})
        Student.Content.showThemes()
    }
}

export { unlockProductCards }