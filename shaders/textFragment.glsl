uniform int uCurrentIndex;
uniform int uMyIndex;

void main() {
    vec4 color = vec4(1.0, 1.0, 1.0, uMyIndex == uCurrentIndex ? 1.0 : 0.9);
    gl_FragColor = color;
}