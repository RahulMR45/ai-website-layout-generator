from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import base64
import os
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

app = Flask(__name__)
CORS(app)

openai.api_key = os.getenv('OPENAI_API_KEY')

def generate_website_code(data):
    prompt = f"""Generate a complete HTML, CSS, and JavaScript code for a {data['websiteType']} website 
    in the {data['industry']} industry. Use {data['color']} as the primary color and {data['font']} font. 
    Include sections: {', '.join(data['sections'])}. 
    Description: {data['description']}.The website should have a good background image and a great mesmerizing css.
    It should attract the users.
    
    Provide a complete, responsive, modern website code."""

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a expert web developer"},
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message.content

def capture_website_screenshot(html_content):
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    
    driver = webdriver.Chrome(options=chrome_options)
    driver.set_window_size(1200, 800)
    
    with open('temp_website.html', 'w') as f:
        f.write(html_content)
    
    driver.get(f'file://{os.path.abspath("temp_website.html")}')
    screenshot = driver.get_screenshot_as_png()
    driver.quit()
    
    return base64.b64encode(screenshot).decode('utf-8')

@app.route('/generate-website', methods=['POST'])
def generate_website():
    try:
        data = request.json
        website_code = generate_website_code(data)
        website_image = capture_website_screenshot(website_code)
        
        return jsonify({
            'code': website_code,
            'image': f"data:image/png;base64,{website_image}"
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)