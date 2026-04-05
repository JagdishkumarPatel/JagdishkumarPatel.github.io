import { motion } from 'framer-motion'

export function About() {
  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-center mb-12">About Me</h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg mb-8">
              With over 10+ years of experience in software engineering, I specialize in designing and implementing AI/ML solutions that drive business value. My journey spans from traditional software development to cutting-edge machine learning systems, with a focus on production-ready, scalable architectures.
            </p>
            <p className="text-lg mb-8">
              Currently working as a Principal AI/ML Engineer, I lead teams in building intelligent systems, implementing MLOps practices, and architecting cloud-native solutions. I'm passionate about bridging the gap between research and production, ensuring AI models deliver real-world impact.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">AI/ML Expertise</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Machine Learning & Deep Learning</li>
                  <li>• MLOps & Model Deployment</li>
                  <li>• Python, TensorFlow, PyTorch, Scikit-learn</li>
                  <li>• Computer Vision & NLP</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Technical Leadership</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Cloud Platforms (AWS, Azure, GCP)</li>
                  <li>• Full-Stack Development (React, Node.js, TypeScript)</li>
                  <li>• DevOps & CI/CD (GitHub Actions, Terraform)</li>
                  <li>• Team Leadership & Architecture</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}