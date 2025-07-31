import React from 'react';

const POSLandingPage = () => {
  const features = [
    {
      icon: 'point_of_sale',
      title: 'Smart POS System',
      description: 'Intuitive point-of-sale with AI-powered recommendations and real-time inventory sync.'
    },
    {
      icon: 'analytics',
      title: 'Advanced Analytics',
      description: 'Comprehensive reports and insights to optimize your business performance.'
    },
    {
      icon: 'people',
      title: 'Customer Management',
      description: 'Track customer preferences, purchase history, and loyalty programs.'
    },
    {
      icon: 'inventory_2',
      title: 'Inventory Management',
      description: 'Real-time stock tracking, low stock alerts, and automated reordering.'
    },
    {
      icon: 'store',
      title: 'Multi-location Support',
      description: 'Manage multiple stores from a single dashboard with centralized control.'
    },
    {
      icon: 'smartphone',
      title: 'Mobile App',
      description: 'Access your POS system anywhere with our mobile app for iOS and Android.'
    }
  ];

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      period: 'month',
      description: 'Perfect for small businesses getting started',
      features: [
        '1 Store Location',
        'Basic POS Features',
        'Up to 100 Products',
        'Email Support',
        'Basic Reports',
        'Mobile App Access'
      ],
      popular: false
    },
    {
      id: 'starter',
      name: 'Starter',
      price: 29,
      period: 'month',
      description: 'Great for growing retail businesses',
      features: [
        '1 Store Location',
        'Advanced POS Features',
        'Unlimited Products',
        'Priority Email Support',
        'Advanced Reports & Analytics',
        'Multi-currency Support',
        'Inventory Management',
        'Customer Management',
        'Mobile App Access',
        'API Access'
      ],
      popular: true
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 79,
      period: 'month',
      description: 'Perfect for multi-location businesses',
      features: [
        'Up to 5 Store Locations',
        'All Starter Features',
        'Advanced Analytics',
        'Multi-location Inventory Sync',
        'Advanced Customer Segmentation',
        'Priority Phone Support',
        'Custom Integrations',
        'Advanced Security Features',
        'White-label Options',
        'Dedicated Account Manager'
      ],
      popular: false
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 199,
      period: 'month',
      description: 'For large enterprises with custom needs',
      features: [
        'Unlimited Store Locations',
        'All Professional Features',
        'Custom Development',
        '24/7 Priority Support',
        'Advanced Security & Compliance',
        'Custom Integrations',
        'White-label Solutions',
        'Dedicated Support Team',
        'Custom Training',
        'SLA Guarantees'
      ],
      popular: false
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Store Owner',
      company: 'Fashion Forward',
      content: 'Deal n Done transformed our retail operations. The AI insights help us make better inventory decisions.',
      rating: 5
    },
    {
      name: 'Mike Chen',
      role: 'Operations Manager',
      company: 'Urban Outfitters',
      content: 'The multi-location support is incredible. We manage 5 stores from one dashboard seamlessly.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'CEO',
      company: 'Boutique Collective',
      content: 'Customer management features helped us increase repeat purchases by 40%. Highly recommended!',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">Deal n Done</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="/features" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
              <a href="/about" className="text-gray-600 hover:text-gray-900">About</a>
              <a href="/contact" className="text-gray-600 hover:text-gray-900">Contact</a>
            </nav>
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-900">Sign In</button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Modern POS System for
              <span className="block text-blue-200">Modern Businesses</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Streamline your retail operations with our intelligent point-of-sale system. 
              Manage inventory, track sales, and grow your business with powerful analytics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100">
                Start Free Trial
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Run Your Business
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From inventory management to customer insights, our comprehensive POS system 
              has all the tools you need to succeed.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">{feature.icon === 'point_of_sale' ? '🛒' :
                                           feature.icon === 'analytics' ? '📊' :
                                           feature.icon === 'people' ? '👥' :
                                           feature.icon === 'inventory_2' ? '📦' :
                                           feature.icon === 'store' ? '🏪' :
                                           feature.icon === 'smartphone' ? '📱' : '✨'}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your business needs. All plans include our core features.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan) => (
              <div key={plan.id} className={`bg-white rounded-lg border-2 p-6 ${
                plan.popular ? 'border-blue-500 shadow-lg' : 'border-gray-200'
              }`}>
                {plan.popular && (
                  <div className="bg-blue-500 text-white text-sm font-semibold px-3 py-1 rounded-full text-center mb-4">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{plan.description}</p>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-2 px-4 rounded-lg font-semibold ${
                  plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}>
                  {plan.price === 0 ? 'Get Started Free' : 'Choose Plan'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses that trust Deal n Done for their point-of-sale needs. 
            Start your free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700">
              Start Free Trial
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-gray-900">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Retail Leaders
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what our customers say about their experience with Deal n Done.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="deal-n-done-card p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="material-icons text-yellow-400 text-sm">star</span>
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}, {testimonial.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">D</span>
                </div>
                <span className="ml-2 text-xl font-bold text-white">Deal n Done</span>
              </div>
              <p className="text-sm">
                Modern POS system for modern businesses. Streamline your operations and grow your business.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/features" className="hover:text-white">Features</a></li>
                <li><a href="/pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="/integrations" className="hover:text-white">Integrations</a></li>
                <li><a href="/api" className="hover:text-white">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/about" className="hover:text-white">About</a></li>
                <li><a href="/blog" className="hover:text-white">Blog</a></li>
                <li><a href="/careers" className="hover:text-white">Careers</a></li>
                <li><a href="/contact" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/help" className="hover:text-white">Help Center</a></li>
                <li><a href="/docs" className="hover:text-white">Documentation</a></li>
                <li><a href="/status" className="hover:text-white">Status</a></li>
                <li><a href="/security" className="hover:text-white">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 Deal n Done. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default POSLandingPage; 