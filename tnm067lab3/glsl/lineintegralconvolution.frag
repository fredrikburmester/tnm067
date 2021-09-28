uniform sampler2D vfColor;
uniform sampler2D noiseColor;

uniform int nSteps;
uniform float stepSize;

in vec3 texCoord_;

/*
* Traverse the vector field and sample the noise image
* @param posF Starting position
* @param stepSize length of each step
* @param nSteps the number of steps to traverse
* @param accVal the accumulated value from sampling the noise image
* @param nSamples the number of samples used for v
*/
void traverse(vec2 posF, float stepSize, int nSteps, inout float accVal, inout int nSamples){
    // traverse the vectorfield staring at `posF` for `nSteps` using `stepSize` and sample the noiseColor texture for each position
    // store the accumulated value in `accVal` and the amount of samples in `nSamples`
    
    nSamples += nSteps;
    vec2 position = posF;
    
    for(int step = 0; step < nSteps; step++) {
        
        // Sample normalized vector from vectorfield (vfColor)
        vec2 nVector = normalize(texture(vfColor, position).xy);
        
        // Calculate new position based on euler
        position = position + (nVector * stepSize);
        
        // Sample the color (rgb) information from noise layer (noiseColor) and
        vec3 noise = texture(noiseColor, position).rgb;
        
        // Calculate the gray value from rgb
        float grayValue = (noise.r + noise.g + noise.b)/3;
        accVal += grayValue;
    }
}

void main(void) {
    float accVal = texture(noiseColor, texCoord_.xy).r;
    int nSamples = 1;
    
    //traverse the vector field both forward and backwards to calculate the output color
    traverse(texCoord_.xy, stepSize, nSteps, accVal, nSamples);
    traverse(texCoord_.xy, -stepSize, nSteps, accVal, nSamples);

    // Get average
    accVal = accVal / nSamples;

    FragData0 = vec4(accVal, accVal, accVal, 1);
}
