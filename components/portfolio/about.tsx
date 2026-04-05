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
              With over a decade of experience in software engineering, I specialize in building intelligent systems that leverage AI/ML to solve complex business problems. My expertise spans full-stack development, cloud platforms, and DevOps practices.
            </p>
            <p className="text-lg mb-8">
              I'm passionate about creating scalable, maintainable code and sharing knowledge through technical writing and open-source contributions.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">AI/ML Expertise</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Deep learning, NLP, computer vision</li>
                  <li>• Model deployment and MLOps</li>
                  <li>• Python, TensorFlow, PyTorch</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Technical Skills</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Cloud platforms (AWS, Azure, GCP)</li>
                  <li>• Full-stack development (React, Node.js)</li>
                  <li>• DevOps & CI/CD pipelines</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}